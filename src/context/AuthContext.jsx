// AuthContext has been deprecated in favor of Clerk (frontend) and server-side session handling.
// If you are using Clerk, prefer `useUser` / `useSession` from `@clerk/clerk-react` instead.

export const useAuth = () => {
  throw new Error('useAuth has been removed. Use Clerk `useUser` / `useSession` instead.')
}

export const AuthProvider = ({ children }) => {
  // Kept as a no-op provider for compatibility; do not rely on it.
  return children
}


