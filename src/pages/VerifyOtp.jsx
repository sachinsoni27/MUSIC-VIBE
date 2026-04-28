import { Navigate } from 'react-router-dom'

// Legacy verify page removed — use Clerk flows instead
export default function VerifyOtp() {
  return <Navigate to="/clerk-signup" replace />
}