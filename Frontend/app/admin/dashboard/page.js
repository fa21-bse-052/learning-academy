'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  Users, BookOpen, Award, TrendingUp, Settings, Plus, Search, Filter, Download,
  Bell, ChevronDown, Play, CheckCircle, Clock, Star, BarChart3, PieChart, Calendar,
  FileText, Upload, Edit, X, Brain, Trash2, Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  // State for tabs
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Stats state updated from backend
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    completedCertifications: 0, // update if needed
    avgCompletion: 0,           // update if needed
  });

  // State for tracking quiz generation progress
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Add-course modal + form state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    videoType: 'upload',
    videoFile: null,
    videoLink: '',
    passingCriteria: 70,
    numQuestions: 5, // new field for number of questions
    quizGenerated: false
  });

  // State to hold courses fetched from the backend
  const [courses, setCourses] = useState([]);

  // Fetch courses and stats from backend when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch courses
        const resCourses = await fetch('http://localhost:8000/api/courses');
        if (!resCourses.ok) throw new Error("Failed to fetch courses");
        const coursesData = await resCourses.json();
        setCourses(coursesData.courses);

        // Fetch users to count total users
        const resUsers = await fetch('http://localhost:8000/auth/users');
        if (!resUsers.ok) throw new Error("Failed to fetch users");
        const usersData = await resUsers.json();
        const totalUsers = usersData.length;

        // Use the courses count from coursesData (assumes your courses endpoint returns {count, courses})
        setStats(prev => ({
          ...prev,
          totalUsers,
          activeCourses: coursesData.count
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Form handlers
  const handleCourseInputChange = (field, value) => {
    setNewCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setNewCourse(prev => ({ ...prev, videoFile: file }));
  };

  const handleSaveCourse = () => {
    console.log('Saving course:', newCourse);
    // Here you would typically call your backend to save the course
    setNewCourse({
      title: '',
      videoType: 'upload',
      videoFile: null,
      videoLink: '',
      passingCriteria: 70,
      numQuestions: 5, // new field for number of questions
      quizGenerated: false
    });
    setShowAddCourseModal(false);
  };

  const handleCloseModal = () => {
    setShowAddCourseModal(false);
    setNewCourse({
      title: '',
      videoType: 'upload',
      videoFile: null,
      videoLink: '',
      passingCriteria: 70,
      numQuestions: 5, // new field for number of questions
      quizGenerated: false
    });
  };

  const handleGenerateQuiz = async () => {
    if (!newCourse.title || (!newCourse.videoFile && !newCourse.videoLink)) {
      console.error("Please add course title and video before generating quiz");
      return;
    }

    setIsGeneratingQuiz(true);
    const formData = new FormData();
    formData.append("course_title", newCourse.title);
    formData.append("passing_criteria", newCourse.passingCriteria);
    formData.append("num_questions", newCourse.numQuestions); // use user input
    if (newCourse.videoFile) {
      formData.append("video_file", newCourse.videoFile);
    }

    try {
      const res = await fetch('http://localhost:8000/api/video-to-quiz', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        throw new Error("Failed to generate quiz");
      }
      const data = await res.json();
      console.log('Quiz generation successful:', data);
      setNewCourse(prev => ({ ...prev, quizGenerated: true }));
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleDeleteCourse = async (video_id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/courses/${video_id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error("Failed to delete course");
      }
      const data = await res.json();
      console.log(data.message);
      // Remove deleted course from local state
      setCourses(prev => prev.filter(course => course.video_id !== video_id));
      // Update active courses count
      setStats(prev => ({ ...prev, activeCourses: prev.activeCourses - 1 }));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('isUserLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      setShowUserDropdown(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  // Render functions
  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-gray-500">Active Courses</p>
          <p className="text-3xl font-bold">{stats.activeCourses}</p>
        </div>
      </div>
      {/* You can update any existing charts here with the stats */}
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Manage your learning content and track performance</p>
        </div>
        <button 
          onClick={() => setShowAddCourseModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
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
        {courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-200 transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.course_title}</h3>
                  <p className="text-sm text-gray-600">Video: {course.course_video_name}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Passing Criteria: {course.passing_criteria}%</span>
                  <span className="text-gray-600">
                    Created: {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button 
                  className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  onClick={() => handleDeleteCourse(course.video_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No courses found.</p>
        )}
      </div>

      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Course</h3>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => handleCourseInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Course Video *</label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="videoType"
                      value="upload"
                      checked={newCourse.videoType === 'upload'}
                      onChange={(e) => handleCourseInputChange('videoType', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Upload Video File</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="videoType"
                      value="link"
                      checked={newCourse.videoType === 'link'}
                      onChange={(e) => handleCourseInputChange('videoType', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Video Link</span>
                  </label>
                </div>
                {newCourse.videoType === 'upload' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="videoUpload"
                    />
                    <label htmlFor="videoUpload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {newCourse.videoFile ? newCourse.videoFile.name : 'Click to upload video file'}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Supported formats: MP4, MOV, AVI (Max 500MB)
                        </span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={newCourse.videoLink}
                    onChange={(e) => handleCourseInputChange('videoLink', e.target.value)}
                    placeholder="https://example.com/video-link"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Passing Criteria (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCourse.passingCriteria}
                    onChange={(e) =>
                      handleCourseInputChange(
                        'passingCriteria',
                        Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 text-gray-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum percentage required to pass this course
                </p>
              </div>
              {/* New input for number of questions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  value={newCourse.numQuestions}
                  onChange={(e) =>
                    handleCourseInputChange(
                      'numQuestions',
                      Number.isNaN(parseInt(e.target.value)) ? 5 : parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Course Quiz
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-700">
                      Generate quiz questions from the course video
                    </span>
                    {newCourse.quizGenerated && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Quiz Ready
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateQuiz}
                    disabled={
                      isGeneratingQuiz ||
                      !newCourse.title ||
                      (!newCourse.videoFile && !newCourse.videoLink)
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {isGeneratingQuiz
                      ? 'Generating quiz, please wait...'
                      : newCourse.quizGenerated
                      ? 'Regenerate Quiz from Video'
                      : 'Generate Quiz from Video'}
                  </button>
                  {(!newCourse.title || (!newCourse.videoFile && !newCourse.videoLink)) && (
                    <p className="text-xs text-gray-500 mt-2">
                      Please add course title and video before generating quiz
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCourse}
                  disabled={!newCourse.title || (!newCourse.videoFile && !newCourse.videoLink)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Save Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Settings content */}
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}
