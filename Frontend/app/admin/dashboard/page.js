'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Settings, 
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  ChevronDown,
  Play,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Calendar,
  FileText,
  Upload,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

const handleLogout = () => {
  try {
    localStorage.removeItem('isAdminLoggedIn');
    
    // Clear any other auth-related items you might have
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    
    setShowUserDropdown(false);
    // Redirect to home page
    router.push('/');
    
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, still try to redirect
    router.push('/');
  }
};
  // Mock data - in real implementation, this would come from backend
  const stats = {
    totalUsers: 1247,
    activeCourses: 23,
    completedCertifications: 892,
    avgCompletion: 78
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', lastActive: '2 hours ago', progress: 85 },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@company.com', department: 'Marketing', lastActive: '1 day ago', progress: 92 },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', lastActive: '3 hours ago', progress: 67 },
    { id: 4, name: 'Emily Brown', email: 'emily@company.com', department: 'HR', lastActive: '5 minutes ago', progress: 100 },
  ];

  const courses = [
    { id: 1, title: 'React Fundamentals', instructor: 'Admin', students: 156, completion: 72, status: 'active', duration: '4 hours' },
    { id: 2, title: 'Leadership Skills', instructor: 'Admin', students: 89, completion: 85, status: 'active', duration: '6 hours' },
    { id: 3, title: 'Data Analytics', instructor: 'Admin', students: 203, completion: 69, status: 'active', duration: '8 hours' },
    { id: 4, title: 'Communication Skills', instructor: 'Admin', students: 145, completion: 91, status: 'completed', duration: '3 hours' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors duration-200">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="text-gray-600 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCourses}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full hover:bg-green-200 transition-colors duration-200">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+3</span>
            <span className="text-gray-600 ml-2">new this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certifications</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedCertifications}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full hover:bg-yellow-200 transition-colors duration-200">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+18%</span>
            <span className="text-gray-600 ml-2">completion rate</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Completion</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgCompletion}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full hover:bg-purple-200 transition-colors duration-200">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+5%</span>
            <span className="text-gray-600 ml-2">improvement</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4">Learning Progress Overview</h3>
          <div className="h-64">
            <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
              <span>Monthly Progress</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                  <span>In Progress</span>
                </div>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[
                { month: 'Jan', completed: 85, inProgress: 35 },
                { month: 'Feb', completed: 92, inProgress: 28 },
                { month: 'Mar', completed: 78, inProgress: 42 },
                { month: 'Apr', completed: 95, inProgress: 25 },
                { month: 'May', completed: 88, inProgress: 32 },
                { month: 'Jun', completed: 102, inProgress: 18 }
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full max-w-12 flex flex-col items-center justify-end h-40 mb-2">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                      style={{ height: `${(data.completed / 120) * 100}%` }}
                      title={`Completed: ${data.completed}`}
                    ></div>
                    <div 
                      className="w-full bg-blue-200 hover:bg-blue-300 transition-colors duration-200 cursor-pointer"
                      style={{ height: `${(data.inProgress / 120) * 100}%` }}
                      title={`In Progress: ${data.inProgress}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-lg font-semibold mb-4">Course Distribution</h3>
          <div className="h-64 flex items-center justify-center relative">
            {/* Pie Chart */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Technical Skills - 35% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="15"
                  strokeDasharray="87.96 251.2"
                  strokeDashoffset="0"
                  className="hover:stroke-blue-600 transition-colors duration-200 cursor-pointer"
                />
                {/* Soft Skills - 30% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="15"
                  strokeDasharray="75.4 251.2"
                  strokeDashoffset="-87.96"
                  className="hover:stroke-green-600 transition-colors duration-200 cursor-pointer"
                />
                {/* Leadership - 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="15"
                  strokeDasharray="50.24 251.2"
                  strokeDashoffset="-163.36"
                  className="hover:stroke-amber-600 transition-colors duration-200 cursor-pointer"
                />
                {/* Compliance - 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="15"
                  strokeDasharray="37.68 251.2"
                  strokeDashoffset="-213.6"
                  className="hover:stroke-purple-600 transition-colors duration-200 cursor-pointer"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-3">
              <div className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded transition-colors duration-200 cursor-pointer">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Technical</div>
                  <div className="text-xs text-gray-600">8 courses (35%)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 hover:bg-green-50 p-2 rounded transition-colors duration-200 cursor-pointer">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Soft Skills</div>
                  <div className="text-xs text-gray-600">7 courses (30%)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 hover:bg-amber-50 p-2 rounded transition-colors duration-200 cursor-pointer">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Leadership</div>
                  <div className="text-xs text-gray-600">5 courses (20%)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 hover:bg-purple-50 p-2 rounded transition-colors duration-200 cursor-pointer">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Compliance</div>
                  <div className="text-xs text-gray-600">3 courses (15%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent User Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded transition-colors duration-200">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{user.department}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${user.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{user.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Manage your learning content and track performance</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <Plus className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600">by {course.instructor}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {course.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Students: {course.students}</span>
                <span className="text-gray-600">Duration: {course.duration}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">{course.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${course.completion}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1">
                <Eye className="h-4 w-4" />
                View
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Monitor user progress and manage enrollments</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Progress</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Certifications</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Last Active</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{user.department}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${user.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{user.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full">
                      {Math.floor(user.progress / 20)} earned
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.lastActive}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your learning academy settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academy Name</label>
              <input type="text" defaultValue="Learning Academy" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Certification Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input type="number" defaultValue="70" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Template</label>
              <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           <div className="flex items-center">
  <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
</div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">A</span>
                  </div>
                  <span className="hidden sm:block">Admin User</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Preferences
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}