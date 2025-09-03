import { createClient } from '@supabase/supabase-js'

// Check if we have valid Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate URL format
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Singleton pattern for Supabase client
let supabaseInstance = null
let isSupabaseConfigured = false

function createSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  console.log('🔍 Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlValue: supabaseUrl?.substring(0, 30) + '...',
    keyLength: supabaseAnonKey?.length
  })

  if (supabaseUrl && 
      supabaseAnonKey && 
      supabaseUrl !== 'your-project-url-here' && 
      supabaseAnonKey !== 'your-anon-key-here' &&
      isValidUrl(supabaseUrl) &&
      supabaseUrl.includes('supabase.co')) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            'X-Client-Info': 'uirobot@1.0.0'
          }
        }
      })
      isSupabaseConfigured = true
      console.log('✅ Supabase configured successfully')
      console.log('🎯 Demo Mode: Using mock authentication only')
    } catch (error) {
      console.warn('⚠️ Supabase configuration failed:', error.message)
      console.log('📱 Using mock authentication instead')
    }
  } else {
    console.log('📱 Supabase not configured, using mock authentication')
    console.log('💡 Environment variables missing or invalid')
    console.log('💡 To use real database, update environment variables')
  }

  return supabaseInstance
}

// Create Supabase client
const supabase = createSupabaseClient()

// Mock authentication for development/demo
const mockAuth = {
  // Demo users - เพิ่มเติม users สำหรับทดสอบ
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
    },
    { 
      id: '4', 
      email: 'test@robot.com', 
      password: 'test123456',
      name: 'Test User',
      role: 'user'
    },
    { 
      id: '5', 
      email: 'manager@robot.com', 
      password: 'manager123456',
      name: 'Manager User',
      role: 'manager'
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
    console.log('🎭 Using Mock Registration for Demo')
    return await mockAuth.signUp(email, password, userData)
  },

  // Sign in user
  signIn: async (email, password) => {
    // Use mock authentication as primary method for demo
    console.log('🎭 Using Mock Authentication for Demo')
    const mockResult = await mockAuth.signIn(email, password)
    
    if (mockResult.data) {
      console.log('✅ Mock authentication successful')
      return mockResult
    } else {
      console.log('❌ Mock authentication failed')
      return mockResult
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

// Database functions for robot system (Real Supabase queries)
export const database = {
  // Get user's robots
  getUserRobots: async (userId) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('robots')
          .select(`
            *,
            robot_status (
              battery_level,
              temperature,
              network_quality,
              created_at
            )
          `)
          .eq('owner_id', userId)
          .order('created_at', { ascending: false })
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockRobots = [
            {
              id: '1',
              name: 'Robot Alpha',
              type: 'delivery',
              location: 'อาคาร A ชั้น 1',
              status: 'online',
              created_at: new Date().toISOString(),
              robot_status: [{ battery_level: 85, temperature: 42.5, network_quality: 88 }]
            },
            {
              id: '2',
              name: 'Robot Beta',
              type: 'security',
              location: 'อาคาร A ชั้น 2',
              status: 'online',
              created_at: new Date().toISOString(),
              robot_status: [{ battery_level: 72, temperature: 41.8, network_quality: 92 }]
            },
            {
              id: '3',
              name: 'Robot Gamma',
              type: 'cleaning',
              location: 'อาคาร B ชั้น 1',
              status: 'maintenance',
              created_at: new Date().toISOString(),
              robot_status: [{ battery_level: 20, temperature: 43.1, network_quality: 75 }]
            }
          ]
          resolve({ data: mockRobots, error: null })
        }, 500)
      })
    }
  },

  // Get robot status (real-time data)
  getRobotStatus: async (robotId) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('robot_status')
          .select('*')
          .eq('robot_id', robotId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Fallback to mock data
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockStatus = {
            id: '1',
            robot_id: robotId,
            battery_level: Math.floor(Math.random() * 100),
            temperature: 40 + Math.random() * 10,
            position_x: Math.random() * 100,
            position_y: Math.random() * 100,
            speed: Math.random() * 10,
            network_quality: 80 + Math.random() * 20,
            cpu_usage: Math.random() * 100,
            memory_usage: Math.random() * 100,
            created_at: new Date().toISOString()
          }
          resolve({ data: mockStatus, error: null })
        }, 300)
      })
    }
  },

  // Subscribe to robot status changes (Real-time)
  subscribeToRobotStatus: (robotId, callback) => {
    if (isSupabaseConfigured) {
      const subscription = supabase
        .channel(`robot_status_${robotId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'robot_status',
            filter: `robot_id=eq.${robotId}`
          },
          callback
        )
        .subscribe()

      return {
        unsubscribe: () => subscription.unsubscribe()
      }
    } else {
      // Fallback to mock real-time updates
      const interval = setInterval(() => {
        const mockData = {
          eventType: 'UPDATE',
          new: {
            battery_level: Math.floor(Math.random() * 100),
            temperature: 40 + Math.random() * 10,
            network_quality: 80 + Math.random() * 20,
            created_at: new Date().toISOString()
          }
        }
        callback(mockData)
      }, 3000)

      return {
        unsubscribe: () => clearInterval(interval)
      }
    }
  },

  // Get alerts
  getAlerts: async (userId) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select(`
            *,
            robots (
              name
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Fallback to mock data
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
    }
  },

  // Update robot position
  updateRobotPosition: async (robotId, position) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('robot_status')
          .insert({
            robot_id: robotId,
            position_x: position.x,
            position_y: position.y,
            created_at: new Date().toISOString()
          })
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Fallback to mock
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true }, error: null })
        }, 200)
      })
    }
  },

  // Create maintenance log
  createMaintenanceLog: async (robotId, type, description) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('maintenance_logs')
          .insert({
            robot_id: robotId,
            type,
            description,
            completed_at: new Date().toISOString()
          })
          .select()
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Fallback to mock
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
  },

  // Add robot
  addRobot: async (robotData) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('robots')
          .insert(robotData)
          .select()
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Mock add robot
      return new Promise((resolve) => {
        setTimeout(() => {
          const newRobot = {
            id: Date.now().toString(),
            ...robotData,
            created_at: new Date().toISOString()
          }
          resolve({ data: [newRobot], error: null })
        }, 500)
      })
    }
  },

  // Update robot status
  updateRobotStatus: async (robotId, statusData) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('robot_status')
          .insert({
            robot_id: robotId,
            ...statusData,
            created_at: new Date().toISOString()
          })
        
        return { data, error }
      } catch (error) {
        return { data: null, error }
      }
    } else {
      // Mock update
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true }, error: null })
        }, 200)
      })
    }
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
