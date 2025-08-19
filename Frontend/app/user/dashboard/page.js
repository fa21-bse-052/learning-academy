"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Users,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  Zap,
} from "lucide-react";

export default function LearningAcademyDashboard() {
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Fetch user data from /auth/me using token from sessionStorage
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No token found in sessionStorage");

        const res = await fetch(`http://localhost:8000/auth/me?token=${token}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUserName(data.username || sessionStorage.getItem("userName") || "User");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName(sessionStorage.getItem("userName") || "User");
      }
    };

    fetchUserData();

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("isUserLoggedIn");
    window.location.replace("/");
    setShowLogoutModal(false);
  };

  
  const stats = [
    { 
      label: 'Courses Completed', 
      value: '12', 
      icon: BookOpen, 
      color: 'from-emerald-500 to-emerald-600',
      change: '+3 this month',
      changeType: 'positive'
    },
    { 
      label: 'Certificates Earned', 
      value: '8', 
      icon: Award, 
      color: 'from-amber-500 to-amber-600',
      change: '+2 this month',
      changeType: 'positive'
    },
    { 
      label: 'Learning Hours', 
      value: '47', 
      icon: Clock, 
      color: 'from-blue-500 to-blue-600',
      change: '+12 this week',
      changeType: 'positive'
    },
    { 
      label: 'Quiz Average', 
      value: '87%', 
      icon: TrendingUp, 
      color: 'from-purple-500 to-purple-600',
      change: '+5% improvement',
      changeType: 'positive'
    }
  ];

  // Current courses jo hai
  const currentCourses = [
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

  // Recent achievements
  const recentAchievements = [
    { 
      title: 'JavaScript Expert', 
      description: 'Completed Advanced JavaScript course with 95% score',
      date: '2 days ago',
      type: 'certificate'
    },
    { 
      title: 'Fast Learner', 
      description: 'Completed 3 courses in one month',
      date: '1 week ago',
      type: 'badge'
    },
    { 
      title: 'Quiz Master', 
      description: 'Scored 100% on Security Fundamentals quiz',
      date: '2 weeks ago',
      type: 'achievement'
    }
  ];

  // Learning path which are recommendated
  const learningPaths = [
    {
      title: 'Full Stack Developer',
      courses: 6,
      duration: '3 months',
      completion: 33,
      description: 'Master both frontend and backend development'
    },
    {
      title: 'Data Analyst',
      courses: 4,
      duration: '2 months',
      completion: 0,
      description: 'Learn data analysis and visualization'
    }
  ];

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
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Play className="w-5 h-5 mr-2 text-blue-600" />
                Continue Learning
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 px-2 py-1 rounded">View All</button>
            </div>
            
            <div className="space-y-4">
              {currentCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {course.instructor}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={`px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                        <span className="text-gray-500">{course.category}</span>
                        <span className="text-gray-500">{course.timeRemaining} remaining</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-1">
                      <Play className="w-4 h-4" />
                      <span>Continue</span>
                    </button>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Next:</span> {course.nextLesson}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Goals & Achievements */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              This Month's Goals
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Complete 2 Courses</span>
                    <span className="font-medium text-gray-900">1/2</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Study 20 Hours</span>
                    <span className="font-medium text-gray-900">14/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Earn 1 Certificate</span>
                    <span className="font-medium text-green-600">✓ Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-amber-600" />
              Recent Achievements
            </h3>
            
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.type === 'certificate' ? 'bg-amber-100' :
                      achievement.type === 'badge' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {achievement.type === 'certificate' ? <Award className="w-5 h-5 text-amber-600" /> :
                       achievement.type === 'badge' ? <Star className="w-5 h-5 text-purple-600" /> :
                       <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                      <p className="text-gray-400 text-xs mt-1">{achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Courses & Learning Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Courses */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Recommended for You
            </h2>
            
            <div className="space-y-4">
              {availableCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {course.instructor}</p>
                      <div className="flex items-center space-x-4 text-xs mb-3">
                        <span className={`px-2 py-1 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                        <span className="text-gray-500">{course.category}</span>
                        <span className="text-gray-500">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students} students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {course.preview && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 hover:border-blue-300 px-3 py-1 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                          Preview
                        </button>
                      )}
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Learning Paths
            </h2>
            
            <div className="space-y-4">
              {learningPaths.map((path, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span>{path.courses} courses</span>
                        <span>{path.duration}</span>
                      </div>
                      
                      {path.completion > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">{path.completion}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                              style={{ width: `${path.completion}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-1">
                      <span>{path.completion > 0 ? 'Continue' : 'Start Path'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm border border-gray-200 flex items-center justify-center space-x-2 hover:shadow-md hover:-translate-y-0.5">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Study</span>
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm border border-gray-200 flex items-center justify-center space-x-2 hover:shadow-md hover:-translate-y-0.5">
                    <Award className="w-4 h-4" />
                    <span>View Certificates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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