import { createClient } from '@supabase/supabase-js'

// Check if we have valid Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if we have valid credentials
let supabase = null
let isSupabaseConfigured = false

if (supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-ref.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key') {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  isSupabaseConfigured = true
}

// Mock authentication for development/demo
const mockAuth = {
  // Demo users
  demoUsers: [
    { 
      id: '1', 
      email: 'demo@robot.com', 
      password: 'demo123456',
      name: 'Demo User',
      role: 'admin'
    },
    { 
      id: '2', 
      email: 'admin@robot.com', 
      password: 'admin123456',
      name: 'Admin User',
      role: 'admin'
    },
    { 
      id: '3', 
      email: 'user@robot.com', 
      password: 'user123456',
      name: 'Regular User',
      role: 'user'
    }
  ],

  // Current user storage
  currentUser: null,

  // Sign in with mock data
  signIn: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockAuth.demoUsers.find(u => u.email === email && u.password === password)
        if (user) {
          mockAuth.currentUser = { ...user, password: undefined }
          if (typeof window !== 'undefined') {
            localStorage.setItem('mockUser', JSON.stringify(mockAuth.currentUser))
          }
          resolve({ 
            data: { user: mockAuth.currentUser }, 
            error: null 
          })
        } else {
          resolve({ 
            data: null, 
            error: { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
          })
        }
      }, 1000) // Simulate network delay
    })
  },

  // Sign up (just add to demo users for testing)
  signUp: async (email, password, userData = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = mockAuth.demoUsers.find(u => u.email === email)
        if (existingUser) {
          resolve({ 
            data: null, 
            error: { message: 'ผู้ใช้นี้มีอยู่แล้ว' }
          })
        } else {
          const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name: userData.name || email.split('@')[0],
            role: 'user'
          }
          mockAuth.demoUsers.push(newUser)
          mockAuth.currentUser = { ...newUser, password: undefined }
          if (typeof window !== 'undefined') {
            localStorage.setItem('mockUser', JSON.stringify(mockAuth.currentUser))
          }
          resolve({ 
            data: { user: mockAuth.currentUser }, 
            error: null 
          })
        }
      }, 1000)
    })
  }
}

// Authentication functions - use Supabase if configured, otherwise use mock
export const auth = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData
          }
        })
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      return await mockAuth.signUp(email, password, userData)
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      return await mockAuth.signIn(email, password)
    }
  },

  // Sign out user
  signOut: async () => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signOut()
        return { error }
      } catch (error) {
        return { error }
      }
    } else {
      return new Promise((resolve) => {
        mockAuth.currentUser = null
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mockUser')
        }
        resolve({ error: null })
      })
    }
  },

  // Get current user
  getCurrentUser: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
      } catch (error) {
        return { user: null, error }
      }
    } else {
      return new Promise((resolve) => {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('mockUser')
          if (storedUser) {
            mockAuth.currentUser = JSON.parse(storedUser)
            resolve({ user: mockAuth.currentUser, error: null })
          } else {
            resolve({ user: null, error: null })
          }
        } else {
          resolve({ user: null, error: null })
        }
      })
    }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    if (isSupabaseConfigured) {
      return supabase.auth.onAuthStateChange(callback)
    } else {
      // Mock auth state change listener
      return {
        data: { subscription: { unsubscribe: () => {} } },
        unsubscribe: () => {}
      }
    }
  },

  // Reset password
  resetPassword: async (email) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        })
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            data: { message: 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว' }, 
            error: null 
          })
        }, 1000)
      })
    }
  },

  // Get demo credentials for testing
  getDemoCredentials: () => {
    return {
      admin: { email: 'admin@robot.com', password: 'admin123456' },
      demo: { email: 'demo@robot.com', password: 'demo123456' },
      user: { email: 'user@robot.com', password: 'user123456' }
    }
  }
}

// Database functions for robot system (Mock data for demo)
export const database = {
  // Get user's robots
  getUserRobots: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockRobots = [
          {
            id: '1',
            name: 'Robot Alpha',
            type: 'delivery',
            location: 'อาคาร A ชั้น 1',
            status: 'online',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Robot Beta',
            type: 'security',
            location: 'อาคาร A ชั้น 2',
            status: 'online',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Robot Gamma',
            type: 'cleaning',
            location: 'อาคาร B ชั้น 1',
            status: 'maintenance',
            created_at: new Date().toISOString()
          }
        ]
        resolve({ data: mockRobots, error: null })
      }, 500)
    })
  },

  // Get robot status (real-time data)
  getRobotStatus: async (robotId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockStatus = {
          id: '1',
          robot_id: robotId,
          battery_level: Math.floor(Math.random() * 100),
          temperature: 40 + Math.random() * 10,
          position: { x: Math.random() * 100, y: Math.random() * 100 },
          speed: Math.random() * 10,
          network_quality: 80 + Math.random() * 20,
          cpu_usage: Math.random() * 100,
          memory_usage: Math.random() * 100,
          updated_at: new Date().toISOString()
        }
        resolve({ data: mockStatus, error: null })
      }, 300)
    })
  },

  // Subscribe to robot status changes (Mock)
  subscribeToRobotStatus: (robotId, callback) => {
    const interval = setInterval(() => {
      const mockData = {
        eventType: 'UPDATE',
        new: {
          battery_level: Math.floor(Math.random() * 100),
          temperature: 40 + Math.random() * 10,
          network_quality: 80 + Math.random() * 20,
          updated_at: new Date().toISOString()
        }
      }
      callback(mockData)
    }, 3000)

    return {
      unsubscribe: () => clearInterval(interval)
    }
  },

  // Get alerts
  getAlerts: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAlerts = [
          {
            id: '1',
            type: 'warning',
            title: 'แบตเตอรี่ต่ำ',
            message: 'Robot Alpha แบตเตอรี่เหลือ 15%',
            priority: 'high',
            is_read: false,
            created_at: new Date().toISOString(),
            robots: { name: 'Robot Alpha' }
          },
          {
            id: '2',
            type: 'info',
            title: 'งานเสร็จสิ้น',
            message: 'Robot Beta ทำความสะอาดเสร็จสิ้นแล้ว',
            priority: 'medium',
            is_read: true,
            created_at: new Date().toISOString(),
            robots: { name: 'Robot Beta' }
          }
        ]
        resolve({ data: mockAlerts, error: null })
      }, 400)
    })
  },

  // Update robot position
  updateRobotPosition: async (robotId, position) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true }, error: null })
      }, 200)
    })
  },

  // Create maintenance log
  createMaintenanceLog: async (robotId, type, description) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLog = {
          id: Date.now().toString(),
          robot_id: robotId,
          type,
          description,
          completed_at: new Date().toISOString()
        }
        resolve({ data: newLog, error: null })
      }, 300)
    })
  }
}

// Export supabase client (will be null if not configured)
export { supabase }
export default isSupabaseConfigured ? supabase : null

// Demo login function
export const handleDemoLogin = async (onLogin, setIsLoading, setError) => {
  try {
    setIsLoading(true)
    setError('')
    
    // Demo credentials
    const demoEmail = "demo@robot.com"
    const demoPassword = "demo123456"
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword
    })

    if (error) {
      // If demo user doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword
      })
      
      if (!signUpError) {
        onLogin(signUpData.user)
      }
    } else {
      onLogin(data.user)
    }
  } catch (err) {
    setError('Demo login failed')
  } finally {
    setIsLoading(false)
  }
}
