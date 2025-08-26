"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Award, TrendingUp, Clock, Users, Star, ChevronRight, Play, CheckCircle, AlertCircle, Calendar, Target, Brain, Zap } from 'lucide-react';

export default function LearningAcademyDashboard() {
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Fetch current user from backend using the stored access token
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      fetch(`http://localhost:8000/auth/me?token=${token}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          return res.json();
        })
        .then(data => {
          setUserName(data.username);
        })
        .catch(err => console.error("Error fetching current user:", err));
    }

    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

 const handleLogout = () => {
  // Clear any stored authentication data
  localStorage.removeItem('token'); // Remove auth token
  localStorage.removeItem('userEmail'); // Remove user email
  localStorage.removeItem('userName'); // Remove user name
  localStorage.removeItem('isUserLoggedIn'); 
  localStorage.removeItem('isAdminLoggedIn'); // 
  sessionStorage.clear(); // Clear all session storage
  
  // Use replace instead of href for better logout
  window.location.replace('/'); 
  
  setShowLogoutModal(false);
};

  const stats = [
    { 
      label: 'Courses Completed', 
      value: '12', 
      icon: BookOpen, 
      color: 'from-emerald-500 to-emerald-600',
    },
    { 
      label: 'Certificates Earned', 
      value: '8', 
      icon: Award, 
      color: 'from-amber-500 to-amber-600',
    },
    { 
      label: 'Learning Hours', 
      value: '47', 
      icon: Clock, 
      color: 'from-blue-500 to-blue-600',
    },
    { 
      label: 'Quiz Average', 
      value: '87%', 
      icon: TrendingUp, 
      color: 'from-purple-500 to-purple-600',
    }
  ];

  // Current courses jo hai
/*  const currentCourses = [
    {
      title: 'Advanced JavaScript Concepts',
      instructor: 'Dr. Sarah Chen',
      progress: 75,
      nextLesson: 'Async/Await Patterns',
      timeRemaining: '2h 30m',
      difficulty: 'Advanced',
      category: 'Programming'
    },
    {
      title: 'Data Security Fundamentals',
      instructor: 'Mark Thompson',
      progress: 45,
      nextLesson: 'Encryption Methods',
      timeRemaining: '4h 15m',
      difficulty: 'Intermediate',
      category: 'Security'
    },
    {
      title: 'Project Management Essentials',
      instructor: 'Lisa Rodriguez',
      progress: 90,
      nextLesson: 'Final Assessment',
      timeRemaining: '1h 00m',
      difficulty: 'Beginner',
      category: 'Management'
    }
  ];

  // Available courses
  const availableCourses = [
    {
      title: 'Machine Learning Fundamentals',
      instructor: 'Prof. David Kim',
      duration: '8 weeks',
      students: 234,
      rating: 4.8,
      difficulty: 'Advanced',
      category: 'AI/ML',
      preview: true
    },
    {
      title: 'UI/UX Design Principles',
      instructor: 'Emma Wilson',
      duration: '6 weeks',
      students: 189,
      rating: 4.9,
      difficulty: 'Intermediate',
      category: 'Design',
      preview: true
    },
    {
      title: 'Cloud Computing Basics',
      instructor: 'John Miller',
      duration: '4 weeks',
      students: 312,
      rating: 4.7,
      difficulty: 'Beginner',
      category: 'Cloud',
      preview: false
    }
  ];
*/
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-500 bg-green-100';
      case 'Intermediate': return 'text-yellow-500 bg-yellow-100';
      case 'Advanced': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
                  <p className="text-sm text-gray-500">Empowering our people through learning</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{userName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                <p className="font-mono text-blue-600">{currentTime}</p>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${stat.changeType === 'positive' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         
</div>
</div>
         
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout? Your learning progress will be saved.</p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}