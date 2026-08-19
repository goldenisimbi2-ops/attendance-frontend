import { useEffect, useState } from 'react'

function DataLoaderCard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        const result = []
        if (isMounted) setData(result)
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <p>Loading records...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="shell-card">
      <h2>System overview</h2>
      <p>Loaded {data.length} records.</p>
    </div>
  )
}

export default DataLoaderCard
