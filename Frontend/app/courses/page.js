"use client";

import React, { useState } from 'react';
import { Star, Clock, Users, Award, Play, BookOpen, Code, BarChart3, ChevronRight, Filter, Search, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Master HTML, CSS, JavaScript, React, Node.js, and deploy full-stack applications. Build 12+ real projects.",
      category: "Web Development",
      level: "Beginner to Advanced",
      duration: "12 weeks",
      students: 2847,
      rating: 4.9,
      price: 299,
      originalPrice: 399,
      instructor: "Sarah Johnson",
      skills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "MongoDB"],
      icon: Code,
      gradient: "from-blue-500 to-cyan-500",
      features: ["12+ Projects", "Certificate", "Lifetime Access", "Job Support"],
      preview: "Build Netflix Clone, E-commerce Site, Chat App"
    },
    {
      id: 2,
      title: "Python Programming Mastery",
      description: "From Python basics to advanced concepts. Build web apps, automation scripts, and data analysis tools.",
      category: "Programming",
      level: "Beginner to Intermediate",
      duration: "10 weeks",
      students: 1923,
      rating: 4.8,
      price: 249,
      originalPrice: 349,
      instructor: "Dr. Michael Chen",
      skills: ["Python", "Django", "Flask", "APIs", "Web Scraping", "Automation"],
      icon: BookOpen,
      gradient: "from-green-500 to-emerald-500",
      features: ["8+ Projects", "Certificate", "Code Reviews", "Discord Community"],
      preview: "Build Weather App, Task Manager, Web Scraper"
    },
    {
      id: 3,
      title: "Data Science & Machine Learning",
      description: "Complete data science pipeline: analysis, visualization, ML algorithms, and real-world applications.",
      category: "Data Science",
      level: "Intermediate to Advanced",
      duration: "16 weeks",
      students: 1456,
      rating: 4.9,
      price: 399,
      originalPrice: 499,
      instructor: "Prof. Emily Rodriguez",
      skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Tableau"],
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      features: ["10+ Projects", "Certificate", "Kaggle Competitions", "Industry Mentors"],
      preview: "Predict Stock Prices, Customer Segmentation, NLP Sentiment Analysis"
    },
    {
      id: 4,
      title: "Mobile App Development",
      description: "Build iOS and Android apps with React Native. Deploy to app stores and monetize your apps.",
      category: "Mobile Development",
      level: "Intermediate",
      duration: "14 weeks",
      students: 1087,
      rating: 4.7,
      price: 349,
      originalPrice: 449,
      instructor: "Alex Kim",
      skills: ["React Native", "JavaScript", "Firebase", "Redux", "App Store", "Google Play"],
      icon: Play,
      gradient: "from-orange-500 to-red-500",
      features: ["6+ Apps", "Certificate", "App Store Submission", "Monetization Guide"],
      preview: "Build Social Media App, E-commerce App, Fitness Tracker"
    },
    {
      id: 5,
      title: "UI/UX Design Fundamentals",
      description: "Learn design principles, user research, prototyping, and create stunning user interfaces.",
      category: "Design",
      level: "Beginner to Intermediate",
      duration: "8 weeks",
      students: 967,
      rating: 4.8,
      price: 199,
      originalPrice: 299,
      instructor: "Lisa Wang",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
      icon: Award,
      gradient: "from-indigo-500 to-purple-500",
      features: ["5+ Projects", "Certificate", "Portfolio Review", "Design Resources"],
      preview: "Design Mobile App, Website Redesign, Design System"
    },
    {
      id: 6,
      title: "Cloud Computing & DevOps",
      description: "Master AWS, Docker, Kubernetes, CI/CD pipelines, and modern deployment strategies.",
      category: "Cloud & DevOps",
      level: "Intermediate to Advanced",
      duration: "12 weeks",
      students: 743,
      rating: 4.9,
      price: 379,
      originalPrice: 479,
      instructor: "Robert Taylor",
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Monitoring"],
      icon: TrendingUp,
      gradient: "from-teal-500 to-blue-500",
      features: ["Hands-on Labs", "AWS Credits", "Certificate", "Job Placement"],
      preview: "Deploy Scalable Apps, Setup CI/CD, Monitor Production"
    }
  ];

  const categories = ['All', 'Web Development', 'Programming', 'Data Science', 'Mobile Development', 'Design', 'Cloud & DevOps'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level) => {
    if (level.includes('Beginner')) return 'text-green-600 bg-green-100';
    if (level.includes('Intermediate')) return 'text-yellow-600 bg-yellow-100';
    if (level.includes('Advanced')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transform Your
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Career Today
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of learners mastering in-demand skills with our expert-led courses. 
            Build real projects, earn certificates, and advance your career.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>4.8 Average Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Industry Certificates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, skills, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
            {selectedCategory !== 'All' && (
              <span> in <span className="font-semibold text-blue-600">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const IconComponent = course.icon;
            return (
              <div
                key={course.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                {/* Course Header */}
                <div className={`relative h-48 bg-gradient-to-br ${course.gradient} p-6 flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-white/90 text-sm font-medium">
                      {course.category}
                    </div>
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${course.originalPrice - course.price} OFF
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">{course.rating}</span>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {course.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                          +{course.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {course.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-1 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium">Instructor:</span> {course.instructor}
                  </div>

                  {/* Preview */}
                  {hoveredCourse === course.id && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">What you'll build:</span> {course.preview}
                      </p>
                    </div>
                  )}

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5">
                      <span>Enroll Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
            Join our community of learners and start building the skills that matter. 
            30-day money-back guarantee on all courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors duration-200">
              Browse All Courses
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}