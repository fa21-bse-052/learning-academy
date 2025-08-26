'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, Award, BookOpen, CheckCircle, XCircle, RotateCcw, Play, Trophy, Target, Brain } from 'lucide-react';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, quiz, results
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [checkResult, setCheckResult] = useState(null);

  // Fetch available quizzes from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/quizzes')
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        return res.json();
      })
      .then(data => {
        // data.quizzes contains the array of quizzes with course names
        setQuizzes(data.quizzes);
      })
      .catch(err => console.error("Error fetching quizzes:", err));
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, showResults]);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    // Assume quiz.duration is provided in minutes; adjust if necessary:
    setTimeLeft(quiz.duration * 60);
    setQuizStarted(true);
    setShowResults(false);
    setCurrentView('quiz');
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions_data.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // When quiz is complete, call the backend /check-quiz endpoint
  const handleQuizComplete = async () => {
    // Build an array of answers ordered by question index
    const answersArray = [];
    for (let i = 0; i < selectedQuiz.questions_data.length; i++) {
      answersArray.push(answers[i] !== undefined ? answers[i] : null);
    }
    const answersJSON = JSON.stringify(answersArray);
    try {
      const res = await fetch(`http://localhost:8000/api/check-quiz?video_id=${selectedQuiz.video_id}&answers=${encodeURIComponent(answersJSON)}`);
      if (!res.ok) {
        throw new Error("Failed to check quiz");
      }
      const data = await res.json();
      setScore(data.marks);
      setCheckResult(data);
      setShowResults(true);
    } catch (err) {
      console.error("Error checking quiz:", err);
      // Fall back to local scoring if needed.
      let correctAnswers = 0;
      selectedQuiz.questions_data.forEach((q, index) => {
        if (answers[index] === q.correct) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
      setShowResults(true);
    }
    setQuizStarted(false);
  };

  const resetQuiz = () => {
    setCurrentView('dashboard');
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(0);
    setQuizStarted(false);
    setShowResults(false);
    setScore(0);
    setCheckResult(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Quiz view
  if (currentView === 'quiz' && !showResults) {
    const currentQ = selectedQuiz.questions_data[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions_data.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Quiz Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{selectedQuiz.course_title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  <span className={`font-mono text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Question {currentQuestion + 1} of {selectedQuiz.questions_data.length}
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="border-l-4 border-blue-600 pl-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    answers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-gray-200 bg-gray-100 text-gray-900 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-600 bg-blue-600 shadow-sm'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-lg font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg hover:shadow-xl"
            >
              {currentQuestion === selectedQuiz.questions_data.length - 1 ? 'Finish Quiz' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    // Use API response if available; otherwise, fall back to local score calculation.
    const evaluation = checkResult?.result?.quiz_evaluation || {};
    const marks = evaluation.marks || score;
    const percentage = evaluation.percentage || Math.round((marks / selectedQuiz.questions_data.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <RotateCcw className="w-12 h-12 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            
            <div className="text-6xl font-bold mb-4">
              <span className={passed ? 'text-green-600' : 'text-red-600'}>
                {percentage}%
              </span>
            </div>
            
            <p className="text-xl text-gray-600 mb-8">
              You got {marks} out of {selectedQuiz.questions_data.length} questions correct
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{marks}</div>
                  <div className="text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {selectedQuiz.questions_data.length - marks}
                  </div>
                  <div className="text-gray-600">Incorrect</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => startQuiz(selectedQuiz)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view showing available quizzes
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Learning Academy
            <span className="block text-4xl font-semibold text-blue-600 mt-3">Quiz Center</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Test your knowledge, track your progress, and earn certifications with our comprehensive assessment platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Available Quizzes</p>
                <p className="text-4xl font-bold text-gray-900">{quizzes.length}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Total Questions</p>
                <p className="text-4xl font-bold text-gray-900">
                  {quizzes.reduce((acc, quiz) => {
                    return quiz.quiz ? acc + quiz.quiz.length : acc;
                  }, 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Certifications</p>
                <p className="text-4xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {quizzes.map((quiz) => {
            // Assume the backend returns quiz data with a `quiz` field (array of questions)
            const mergedQuiz = {
              ...quiz,
              questions_data: quiz.quiz, // backend returns full quiz data here
            };
            return (
              <div key={quiz.video_id} className="group">
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden h-full border border-gray-100">
                  <div className={`h-40 bg-gradient-to-r from-blue-900 to-indigo-900 p-8 flex items-center justify-between relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full mb-3 font-medium">
                        {quiz.course_title}
                      </span>
                      <h3 className="text-2xl font-bold text-white leading-tight">{quiz.course_title}</h3>
                    </div>
                    <Brain className="w-16 h-16 text-white/60 relative z-10" />
                  </div>
                  
                  <div className="p-8">
                    <p className="text-gray-600 mb-8 line-clamp-2 text-lg leading-relaxed">Quiz for {quiz.course_title}</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-700 font-medium">Questions</span>
                        <span className="font-bold text-gray-900 text-lg">{mergedQuiz.questions_data.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-700 font-medium">Duration</span>
                        <span className="font-bold text-gray-900 text-lg">{quiz.duration} min</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => startQuiz(mergedQuiz)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105 font-semibold text-lg shadow-md text-white py-4 rounded-xl"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}