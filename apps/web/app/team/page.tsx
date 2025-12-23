import React from 'react';
import { Mail, MapPin, ExternalLink, Users, Award, Briefcase, 
         BookOpen, Code, Globe, University, Star } from 'lucide-react';

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#1E1E24] to-[#0D0D0F] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#C9A227] via-[#F59E0B] to-[#C9A227] bg-clip-text text-transparent">
              The LOGOS Team
            </h1>
            <p className="text-xl text-[#F5F4F2]/80 leading-relaxed">
              Scholars, technologists, and visionaries united in advancing 
              the digital future of classical studies
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Mission Statement */}
        <section className="bg-[#1E1E24] rounded-2xl p-12 border border-[#C9A227]/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <Star className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-[#F5F4F2]/90 leading-relaxed mb-6">
              LOGOS exists to democratize access to the classical world through cutting-edge 
              technology and rigorous scholarship. We believe that ancient texts hold timeless 
              wisdom that should be accessible to scholars, students, and curious minds worldwide.
            </p>
            <p className="text-lg text-[#F5F4F2]/90 leading-relaxed">
              By combining the world's largest searchable classical corpus with advanced AI, 
              semantic analysis, and innovative visualization tools, we're building bridges 
              between antiquity and the digital age—preserving the past while pioneering the future.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Founder & Leadership</h2>
            </div>
          </div>
          
          <div className="bg-[#1E1E24] rounded-2xl p-8 border border-[#C9A227]/20">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-48 h-48 bg-gradient-to-br from-[#C9A227] to-[#F59E0B] rounded-full flex items-center justify-center">
                <div className="w-44 h-44 bg-[#1E1E24] rounded-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#C9A227]" />
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-2 text-[#C9A227]">Dr. [Founder Name]</h3>
                <p className="text-lg text-[#F5F4F2]/80 mb-4">Founder & CEO</p>
                <p className="text-[#F5F4F2]/90 leading-relaxed mb-4">
                  [Placeholder: Comprehensive bio highlighting classical studies background, 
                  technology expertise, previous positions at major universities, published works, 
                  and vision for digital humanities.]
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <span className="px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-sm">Classical Studies</span>
                  <span className="px-3 py-1 bg-[#7C3AED]/20 text-[#7C3AED] rounded-full text-sm">Digital Humanities</span>
                  <span className="px-3 py-1 bg-[#059669]/20 text-[#059669] rounded-full text-sm">Technology Leadership</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advisory Board */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <University className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Advisory Board</h2>
            </div>
            <p className="text-[#F5F4F2]/80 max-w-2xl mx-auto">
              World-renowned scholars guiding LOGOS's academic mission
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#1E1E24] rounded-xl p-6 border border-[#C9A227]/20">
                <div className="w-24 h-24 bg-gradient-to-br from-[#C9A227] to-[#F59E0B] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-[#0D0D0F]" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2 text-[#C9A227]">Prof. [Name]</h3>
                <p className="text-[#F5F4F2]/80 text-center mb-3">[University Name]</p>
                <p className="text-sm text-[#F5F4F2]/70 text-center mb-4">
                  [Placeholder: Specialization in ancient history, literature, or archaeology]
                </p>
                <div className="flex justify-center">
                  <span className="px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded text-xs">
                    Classical Studies
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Team */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Code className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Technical Team</h2>
            </div>
            <p className="text-[#F5F4F2]/80 max-w-2xl mx-auto">
              Expert engineers and data scientists building the future of digital classics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'CTO', specialty: 'System Architecture' },
              { role: 'Lead AI Engineer', specialty: 'NLP & Embeddings' },
              { role: 'Data Scientist', specialty: 'Classical Corpus Analysis' },
              { role: 'Frontend Lead', specialty: 'User Experience' }
            ].map((member, i) => (
              <div key={i} className="bg-[#1E1E24] rounded-xl p-6 border border-[#C9A227]/20 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#C9A227]">[Name]</h3>
                <p className="text-[#F5F4F2]/80 mb-2">{member.role}</p>
                <p className="text-sm text-[#F5F4F2]/70">{member.specialty}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners & Institutions */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Partners & Institutions</h2>
            </div>
            <p className="text-[#F5F4F2]/80 max-w-2xl mx-auto">
              Collaborating with leading universities and cultural institutions worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Harvard University',
              'Oxford University',
              'Perseus Digital Library',
              'British Museum',
              'Vatican Library',
              'Smithsonian Institution'
            ].map((partner, i) => (
              <div key={i} className="bg-[#1E1E24] rounded-xl p-6 border border-[#C9A227]/20 text-center group hover:border-[#C9A227]/40 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C9A227] to-[#F59E0B] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <University className="w-8 h-8 text-[#0D0D0F]" />
                </div>
                <h3 className="text-lg font-bold text-[#C9A227] group-hover:text-[#F59E0B] transition-colors">
                  {partner}
                </h3>
                <p className="text-sm text-[#F5F4F2]/70 mt-2">Research Partner</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-[#1E1E24] rounded-2xl p-12 border border-[#C9A227]/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Contact Us</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Mail className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
              <p className="text-[#F5F4F2]/80">info@logosclassical.com</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Academic Partnerships</h3>
              <p className="text-[#F5F4F2]/80">partnerships@logosclassical.com</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-[#F5F4F2]/80">Cambridge, Massachusetts</p>
            </div>
          </div>
        </section>

        {/* Careers */}
        <section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-[#C9A227] mr-3" />
              <h2 className="text-3xl font-bold">Join Our Mission</h2>
            </div>
            <p className="text-[#F5F4F2]/80 max-w-2xl mx-auto mb-8">
              Help us build the future of classical studies. We're always looking for passionate 
              scholars, engineers, and innovators to join our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Classical Research Fellow', dept: 'Academic', type: 'Full-time' },
              { title: 'Senior Frontend Engineer', dept: 'Engineering', type: 'Full-time' },
              { title: 'Data Scientist - NLP', dept: 'Engineering', type: 'Full-time' },
              { title: 'Academic Partnerships Manager', dept: 'Business', type: 'Full-time' }
            ].map((job, i) => (
              <div key={i} className="bg-[#1E1E24] rounded-xl p-6 border border-[#C9A227]/20 hover:border-[#C9A227]/40 transition-colors">
                <h3 className="text-xl font-bold mb-2 text-[#C9A227]">{job.title}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-sm">
                    {job.dept}
                  </span>
                  <span className="px-3 py-1 bg-[#059669]/20 text-[#059669] rounded-full text-sm">
                    {job.type}
                  </span>
                </div>
                <p className="text-[#F5F4F2]/80 mb-4">
                  [Placeholder: Job description and requirements]
                </p>
                <button className="flex items-center text-[#C9A227] hover:text-[#F59E0B] transition-colors">
                  Learn More <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-[#C9A227] to-[#F59E0B] text-[#0D0D0F] font-semibold px-8 py-3 rounded-xl hover:from-[#F59E0B] hover:to-[#C9A227] transition-all">
              View All Openings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamPage;