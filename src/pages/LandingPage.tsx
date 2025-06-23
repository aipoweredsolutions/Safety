import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, MessageCircle, Award, Users, Star, CheckCircle, ArrowRight, Heart, Lock, Globe, User, School, Briefcase } from 'lucide-react';
import Header from '../components/Header';
import { lessons } from '../data/lessons';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Age-appropriate safety lessons with engaging content and real-world scenarios',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'AI Safety Assistant',
      description: '24/7 AI-powered conversations to answer safety questions and provide guidance',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Gamified learning with badges, points, and milestones to keep learners motivated',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Age-Appropriate Content',
      description: 'Tailored content for different age groups from 5-19 years old',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // Calculate actual lesson counts for each age group
  const getLessonCount = (ageGroup: string) => {
    return lessons.filter(lesson => lesson.ageGroups.includes(ageGroup as any)).length;
  };

  const ageGroups = [
    {
      group: '5-10',
      title: 'Young Learners',
      description: 'Build foundational safety awareness and recognize danger through fun, interactive activities',
      icon: User,
      color: 'from-pink-400 to-purple-400',
      features: [
        'Safe vs unsafe behavior',
        'Stranger danger basics',
        'Good touch vs bad touch',
        'Trusted adults and help',
        'Emergency basics',
        'Saying no and telling',
        'Body cues and feelings',
        'Secrets vs surprises'
      ],
      lessonCount: `8 Lessons`,
      duration: '10-15 min each'
    },
    {
      group: '11-15',
      title: 'Teen Guardians',
      description: 'Strengthen boundaries and understand peer influence with practical safety skills',
      icon: School,
      color: 'from-blue-400 to-cyan-400',
      features: [
        'Types of bullying prevention',
        'Online safety fundamentals',
        'Setting personal boundaries',
        'Peer pressure decisions',
        'Uncomfortable secrets',
        'Recognizing manipulation',
        'Building self-esteem',
        'Healthy friendships'
      ],
      lessonCount: `8 Lessons`,
      duration: '15-20 min each'
    },
    {
      group: '16-19',
      title: 'Young Adults',
      description: 'Navigate relationships with maturity and independence for emerging adults',
      icon: Briefcase,
      color: 'from-green-400 to-teal-400',
      features: [
        'Healthy vs unhealthy relationships',
        'Understanding consent',
        'Online privacy & exploitation',
        'Emotional abuse recognition',
        'Power dynamics awareness',
        'Ending relationships safely',
        'Supporting friends in crisis',
        'Reporting abuse and rights',
        'Unhealthy partner behaviors'
      ],
      lessonCount: `9 Lessons`,
      duration: '20-30 min each'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Parent',
      content: 'My 12-year-old loves the interactive lessons. She\'s learned so much about online safety and healthy boundaries in just a few weeks!',
      rating: 5
    },
    {
      name: 'Mike T.',
      role: 'Teacher',
      content: 'This platform has become an essential part of our safety curriculum. The age-appropriate content is perfectly structured.',
      rating: 5
    },
    {
      name: 'Emma L.',
      role: 'Teen User',
      content: 'The AI chat feature is amazing! I can ask questions without feeling embarrassed, and the answers are really helpful.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Students Learning' },
    { number: `25+`, label: 'Safety Lessons' },
    { number: '99%', label: 'Parent Satisfaction' },
    { number: '24/7', label: 'AI Support' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn Safety Skills
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                That Last a Lifetime
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Interactive safety education platform for children and teenagers (ages 5-19) featuring 
              personalized video content, AI-powered conversations, and engaging lessons designed to 
              keep young learners safe online and offline.
            </p>
            
            <div className="flex justify-center">
              <Link
                to="/auth"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Start Learning Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Groups Section */}
      <section id="age-groups" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tailored Learning for Every Age
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Age-appropriate content designed by safety experts and child development specialists
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2">
                <div className="flex items-start space-x-6 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <group.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{group.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Ages {group.group}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{group.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">{group.lessonCount}</div>
                    <div className="text-sm text-blue-700">Available</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-lg font-bold text-green-600">{group.duration}</div>
                    <div className="text-sm text-green-700">Per Lesson</div>
                  </div>
                </div>

                <Link
                  to="/auth"
                  className={`w-full bg-gradient-to-r ${group.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg`}
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Safety Education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed to make safety learning engaging, 
              effective, and age-appropriate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SafetyLearn Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, effective, and designed with safety in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Age Group</h3>
              <p className="text-gray-600">Select the appropriate age category to ensure content is perfectly tailored for the learner's developmental stage.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Learning</h3>
              <p className="text-gray-600">Engage with personalized video content, interactive lessons, and real-world safety scenarios.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">Monitor learning progress, earn achievements, and build confidence through gamified experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Families Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what parents, teachers, and students are saying about SafetyLearn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Safety Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust SafetyLearn to keep their children safe and informed.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SafetyLearn</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering children and teenagers with essential safety skills through interactive, 
                age-appropriate education that builds confidence and awareness.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#age-groups" className="text-gray-400 hover:text-white transition-colors">Age Groups</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors">Start Learning</Link></li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                <li><span className="text-gray-400">Emergency: 911</span></li>
                <li><span className="text-gray-400">Crisis Text Line: Text HOME to 741741</span></li>
                <li><span className="text-gray-400">National Suicide Prevention: 988</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 SafetyLearn. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Secure & COPPA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;