'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Award, TrendingUp, Play, Star, ArrowRight, Menu, X, ChevronDown } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ students: 0, courses: 0, instructors: 0, completion: 0 });

  useEffect(() => {
    const isUserLoggedIn = localStorage?.getItem('isUserLoggedIn');
    const isAdminLoggedIn = localStorage?.getItem('isAdminLoggedIn');

    if (isUserLoggedIn) {
      router.push('/user/dashboard');
    } else if (isAdminLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, []);

  // Animated counter effect
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const targets = { students: 15420, courses: 150, instructors: 45, completion: 94 };
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setStats({
          students: Math.floor(targets.students * easeOut),
          courses: Math.floor(targets.courses * easeOut),
          instructors: Math.floor(targets.instructors * easeOut),
          completion: Math.floor(targets.completion * easeOut)
        });
        
        if (step === steps) clearInterval(interval);
      }, duration / steps);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description: "Engage with hands-on projects and real-world scenarios"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience"
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certifications upon course completion"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "This academy transformed my career! The courses are incredibly well-structured.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Data Scientist",
      content: "Amazing instructors and practical projects. Highly recommend to everyone!",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "UX Designer",
      content: "The interactive learning approach made complex topics easy to understand.",
      rating: 5
    }
  ];

  const courses = [
    { title: "Web Development", students: "2,341", duration: "12 weeks", level: "Beginner" },
    { title: "Data Science", students: "1,892", duration: "16 weeks", level: "Intermediate" },
    { title: "Mobile Development", students: "1,567", duration: "10 weeks", level: "Advanced" },
    { title: "UI/UX Design", students: "2,108", duration: "8 weeks", level: "Beginner" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Learning Academy
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
            <a href="#testimonials" className="hover:text-blue-400 transition-colors">Reviews</a>
            <a href="#stats" className="hover:text-blue-400 transition-colors">Stats</a>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1b263b]/95 backdrop-blur-lg border-t border-white/10 p-6 space-y-4">
            <a href="#features" className="block hover:text-blue-400 transition-colors">Features</a>
            <a href="#courses" className="block hover:text-blue-400 transition-colors">Courses</a>
            <a href="#testimonials" className="block hover:text-blue-400 transition-colors">Reviews</a>
            <a href="#stats" className="block hover:text-blue-400 transition-colors">Stats</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm animate-pulse">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 15,000+ Students Worldwide
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent block">
              Future Skills
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners advancing their careers through our expert-led courses, 
            interactive projects, and industry-recognized certifications.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="/signup"
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-400/25 flex items-center"
            >
              Start Learning Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
          </div>

          {/* Login Options */}
          <div className="max-w-md mx-auto bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Already Have an Account?</h3>
            <div className="space-y-4">
              <a
                href="/user/login"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] block text-center"
              >
                Student Login
              </a>
              <a
                href="/admin/login"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] block text-center"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                {stats.students.toLocaleString()}+
              </div>
              <div className="text-gray-300">Active Students</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                {stats.courses}+
              </div>
              <div className="text-gray-300">Expert Courses</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                {stats.instructors}+
              </div>
              <div className="text-gray-300">Industry Experts</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform">
                {stats.completion}%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Our Academy?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience learning like never before with our cutting-edge platform and expert instructors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
<section id="courses" className="py-20 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Popular Courses
      </h2>
      <p className="text-xl text-gray-300">
        Join thousands of students in our most sought-after programs
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <div
          key={index}
          className="group bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
        >
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                course.level === "Beginner"
                  ? "bg-green-500/20 text-green-300"
                  : course.level === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {course.level}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-3">{course.title}</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div>👥 {course.students} students</div>
            <div>⏱️ {course.duration}</div>
          </div>

          {/* Changed button -> Link to signup */}
          <a
            href="/signup"
            className="block text-center w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all group-hover:scale-105"
          >
            Enroll Now
          </a>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            What Our Students Say
          </h2>
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xl md:text-2xl italic mb-6 text-gray-200">
                "{testimonials[currentTestimonial].content}"
              </p>
              <div>
                <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-400">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of learners and unlock your potential today
          </p>
          <a
            href="/signup"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#415a77] text-white py-10 px-6 md:px-16">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Logo & Description */}
    <div>
      <h2 className="text-2xl font-bold mb-3">Learning Academy</h2>
      <p className="text-sm text-gray-300">
        Empowering our people through learning
      </p>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
      <ul className="text-sm space-y-2 text-gray-300">
        <li>Email: <a href="mailto:support@yourbrand.com" className="hover:underline">support@learningacademy.com</a></li>
        <li>Phone: <a href="tel:+1234567890" className="hover:underline"> (051) 4490490</a></li>
        <li>CDA Industrial triangle, Kahuta Rd, Islamabad</li>
      </ul>
    </div>

    {/* Social Links */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-blue-400 transition-all">Linkedln</a>
        <a href="#" className="hover:text-blue-400 transition-all">facebook</a>

        <a href="#" className="hover:text-blue-400 transition-all">Instagram</a>
      </div>
    </div>
  </div>

  <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm text-gray-400">
    &copy; {new Date().getFullYear()} Learning Academy. All rights reserved.
  </div>
</footer>

    </div>
  );
}