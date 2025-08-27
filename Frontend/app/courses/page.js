"use client";

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCourse, setHoveredCourse] = useState(null);

  // Fetch courses from backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        return res.json();
      })
      .then(data => {
        // data.courses contains the courses array returned by the backend
        setCourses(data.courses);
      })
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  // Filter courses based on the search term (searching in title and video name)
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_video_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.video_id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredCourse(course.video_id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Course Header */}
              <div className="relative h-48 bg-gradient-to-br from-blue-900 to-indigo-900 p-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    {course.course_title}
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {course.course_title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Video: {course.course_video_name}
                </p>

                <p className="text-sm text-gray-500">
                  Passing Criteria: {course.passing_criteria}
                </p>
                <p className="text-sm text-gray-500">
                  Created At: {new Date(course.created_at).toLocaleDateString()}
                </p>

                {/* Enroll Button */}
                <div className="flex items-center justify-between mt-4">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5">
                    <span>Enroll Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}