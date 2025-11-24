import { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Share2, Download, Smartphone } from 'lucide-react';

const ContactPage = () => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'success'>('idle');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Contact information
  const contactInfo = {
    name: 'R.P. Shivakumar',
    title: 'Founder & CEO',
    company: 'Puviyan Digital Solutions Private Limited',
    email: 'rpshivakumar@puviyan.com',
    phone: '9600590046',
    linkedin: 'https://www.linkedin.com/in/r-p-shivakumar-b05a1032',
  };

  // Generate VCF file content
  const generateVCF = () => {
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.name}
N:${contactInfo.name.split(' ').reverse().join(';')};;;
TITLE:${contactInfo.title}
ORG:${contactInfo.company}
EMAIL;TYPE=INTERNET:${contactInfo.email}
TEL;TYPE=CELL:${contactInfo.phone}
URL:${contactInfo.linkedin}
END:VCARD`;
    return vcfContent;
  };

  // Download VCF file
  const handleSaveContact = () => {
    const vcfContent = generateVCF();
    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contactInfo.name.replace(/\s/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: contactInfo.name,
          text: `${contactInfo.title} at ${contactInfo.company}`,
          url: window.location.href,
        });
        setShareStatus('success');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShareStatus('success');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  // Show message for non-mobile devices
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 via-blue-400 to-green-400 flex items-center justify-center">
            <Smartphone size={40} className="text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Mobile Only Page
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            This contact page is optimized for mobile devices. Please access it from your smartphone for the best experience.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 text-black font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 via-blue-400 to-green-400 flex items-center justify-center text-4xl font-bold">
              {contactInfo.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              {contactInfo.name}
            </h1>
            <p className="text-gray-400 text-sm mb-1">{contactInfo.title}</p>
            <p className="text-gray-500 text-xs">{contactInfo.company}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleSaveContact}
              className="flex-1 bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 text-black font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span className="text-sm">Save Contact</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-white/10 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center"
            >
              <Share2 size={18} />
            </button>
          </div>

          {shareStatus === 'success' && (
            <div className="mb-6 text-center text-sm text-green-400 animate-pulse">
              Link copied to clipboard!
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            {/* Email */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-blue-400/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={20} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium">{contactInfo.email}</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone size={20} className="text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium">{contactInfo.phone}</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Linkedin size={20} className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                <p className="text-sm font-medium">R.P. Shivakumar</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
