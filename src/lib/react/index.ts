import { useRef, useState } from 'react'
import promistate, { PromistateResult, PromistateOptions } from '../..'

export type PromistateReactState<T> = Pick<PromistateResult<T>, 'isEmpty' | 'value' | 'timesSettled' | 'isPending' | 'error'>

function extractStyles<T>(state: PromistateResult<T>): PromistateReactState<T> {
  return {
    isEmpty: state.isEmpty,
    value: state.value,
    timesSettled: state.timesSettled,
    isPending: state.isPending,
    error: state.error
  }
}

export function usePromistate<T>(promise: (...args: any[]) => Promise<T>, options: PromistateOptions<T>) {
  let setState: React.Dispatch<React.SetStateAction<PromistateReactState<T>>> | undefined;

  const promiseRef = useRef(promistate<T>(promise, {
    ...options,
    listen() {
      setState && setState(extractStyles<T>(promiseRef.current))
      options.listen && options.listen()
    }
  }))

  const [state, setStateCopy] = useState(extractStyles(promiseRef.current))
  setState = setStateCopy

  const load = (...args: any[]) => promiseRef.current.load(args)
  const reset = () => promiseRef.current.reset()
  const setValue = (value: T) => promiseRef.current.value = value

  return [state, { load, reset, setValue }]
}
