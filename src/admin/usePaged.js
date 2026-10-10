import { useEffect, useState } from 'react'
import { adminGet } from './adminApi.js'

// Ambil data berhalaman dari endpoint admin; muat ulang saat refreshTick berubah
export default function usePaged(path, adminKey, refreshTick, limit = 25, extraQuery = '') {
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState({ total: 0, items: [] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setOffset(0)
  }, [extraQuery])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    adminGet(`${path}?limit=${limit}&offset=${offset}${extraQuery}`, adminKey)
      .then((res) => {
        if (!cancelled) {
          setData(res)
          setError('')
        }
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [path, adminKey, refreshTick, limit, offset, extraQuery])

  return { data, error, loading, offset, setOffset, limit }
}
