'use client'

import * as React from 'react'
import type { ToastActionElement } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: 'default' | 'destructive'
  promise?: Promise<any>
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  return `toast-${++count}`
}

type ActionType = typeof actionTypes

type Action = {
  type: ActionType[keyof ActionType]
  toast: ToasterToast
}

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toast: { id: toastId } as ToasterToast,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

let dispatch: (value: Action) => void = () => {}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case 'DISMISS_TOAST': {
      const { toast } = action

      // Remove any existing timeouts for this toast
      if (toastTimeouts.has(toast.id)) {
        clearTimeout(toastTimeouts.get(toast.id))
        toastTimeouts.delete(toast.id)
      }

      // Send a new action with the updated toast
      dispatch({
        type: 'UPDATE_TOAST',
        toast: { ...toast, open: false },
      })

      // Start a new timeout to remove the toast completely after it's been dismissed
      addToRemoveQueue(toast.id)

      return state
    }

    case 'REMOVE_TOAST': {
      const { toast } = action
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toast.id),
      }
    }
  }
}

function subscribe(listener: (state: State) => void) {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

function getState() {
  return memoryState
}

// This is a hack to make sure the dispatch function is available in the reducer
// We'll replace it right after we create the store
const initialState = { toasts: [] }
const store = {
  getState,
  dispatch: (action: Action) => {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => listener(memoryState))
  },
  subscribe,
}

dispatch = store.dispatch

export { store }

// We use this to prevent adding the same toast multiple times
const toastsInQueue = new Set<string>()

function toast({ ...props }: Omit<ToasterToast, 'id'>) {
  const { promise, ...rest } = props

  const id = genId()

  const dismiss = () => store.dispatch({ type: 'DISMISS_TOAST', toast: { id } })

  const toastToAdd: ToasterToast = {
    ...rest,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) {
        dismiss()
      }
    },
  }

  if (toastsInQueue.has(id)) {
    // update existing toast
    store.dispatch({
      type: 'UPDATE_TOAST',
      toast: toastToAdd,
    })
  } else {
    // add new toast
    store.dispatch({
      type: 'ADD_TOAST',
      toast: toastToAdd,
    })
    toastsInQueue.add(id)
  }

  // Remove the toast from the queue when it's been dismissed
  toastToAdd.onOpenChange = (open) => {
    if (!open) {
      toastsInQueue.delete(id)
      toastToAdd.onOpenChange?.(open)
    }
  }

  // Handle promises
  if (promise) {
    const p = promise
    p
      .then(() => {
        // We don't need to do anything here, the toast will auto-dismiss
      })
      .catch(() => {
        // We don't need to do anything here, the toast will auto-dismiss
      })
      .finally(() => {
        dismiss()
      })
  }

  return {
    id: () => id,
    dismiss,
  }
}

toast.success = (props: Omit<ToasterToast, 'id' | 'variant'>) => {
  return toast({ ...props, variant: 'default' })
}

toast.error = (props: Omit<ToasterToast, 'id' | 'variant'>) => {
  return toast({ ...props, variant: 'destructive' })
}

toast.info = (props: Omit<ToasterToast, 'id' | 'variant'>) => {
  return toast({ ...props, variant: 'default' })
}

toast.warning = (props: Omit<ToasterToast, 'id' | 'variant'>) => {
  return toast({ ...props, variant: 'default' })
}

toast.promise = <TData, TError>(
  promise: Promise<TData>,
  props: Omit<ToasterToast, 'id' | 'variant' | 'promise'>
) => {
  return toast({ ...props, promise })
}

export { useToast, toast }

function useToast() {
  const [state, setState] = React.useState<State>(store.getState())

  React.useEffect(() => {
    const unsubscribe = store.subscribe(setState)
    return () => unsubscribe()
  }, [])

  return {
    ...state,
    toast,
    dismiss: (id?: string) => {
      if (id) {
        store.dispatch({ type: 'DISMISS_TOAST', toast: { id } as ToasterToast })
      } else {
        // Dismiss all toasts
        store.getState().toasts.forEach((toast) => {
          store.dispatch({ type: 'DISMISS_TOAST', toast })
        })
      }
    },
  }
}
