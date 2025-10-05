import React from 'react'

const communityTestimonials = [
  {
    id: 1,
    username: '@rajesh_dev',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'Love joule edge functions. Cursor+Joule+MCP+Docker desktop is all I need.',
  },
  {
    id: 2,
    username: '@priyanka_builds',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a3?w=100&h=100&fit=crop&crop=face',
    content: 'Lately been using joule over AWS/GCP for products to save on costs and rapid builds(Vibe Code) that do not need all the Infra and the hefty costs that come with AWS/GCP out the door. Great solution overall. Love the new Feature stack thats implemented.',
  },
  {
    id: 3,
    username: '@arjun_stores',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'I\'ve been using @tryjoule for two personal projects and it has been amazing being able to use the power of Postgres and don\'t have to worry about the backend',
  },
  {
    id: 4,
    username: '@sarah_founder',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: 'Really impressed with @tryjoyle AI Assistant.',
  },
  {
    id: 5,
    username: '@dev_kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    content: 'I love everything about joule.',
  },
  {
    id: 6,
    username: '@startup_nina',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    content: 'love whats goin on @tryjoule excited to see what it goes.',
  },
  {
    id: 7,
    username: '@ecom_expert',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
    content: 'Y\'all @joule + @nextjs is amazing 🔥 Barely an hour into a proof-of-concept and already have most of the functionality in place. 😊😊😊',
  },
  {
    id: 8,
    username: '@mikesh_dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    content: 'We\'ve running joule in production. Very good DX. Love the new Feature stack thats implemented.',
  },
  {
    id: 9,
    username: '@store_builder',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
    content: 'joule AI Assistant has saved me hours of development time. Incredible tool!',
  }
]

function TestimonialCard({ testimonial, variant = 'default' }) {
  const base = "w-80 h-48 flex-shrink-0"; // fixed width and height for equality
  const cardStyles = {
    default: `${base} rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-sm hover:bg-neutral-900/60 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10`,
    compact: `${base} rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 backdrop-blur-sm hover:bg-neutral-900/60 transition-all duration-300 hover:border-emerald-400/30`,
    wide: `${base} rounded-xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-900/20 p-6 backdrop-blur-sm hover:from-neutral-900/70 hover:to-neutral-900/40 transition-all duration-300 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-400/5`
  }

  return (
    <div className={cardStyles[variant]}>
      <div className="flex items-start gap-3">
        <div className="relative">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.username}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-neutral-700 hover:ring-emerald-500/30 transition-all duration-300"
          />
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-neutral-900"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
              {testimonial.username}
            </span>
            <svg className="h-4 w-4 text-neutral-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <p className="text-sm leading-6 text-neutral-300 hover:text-neutral-200 transition-colors clamp-5">
            {testimonial.content}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function JoinCommunity() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Join the community
        </h2>
        <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
          Discover what our community has to say about their Sellaora experience.
        </p>
      </div>

      {/* Community Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <a 
          href="https://github.com/jouleaidotcom/sellaora/discussions/59" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-6 py-3 text-sm font-medium text-neutral-200 hover:bg-neutral-700/50 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub discussions
        </a>
        <a 
          href="https://discord.gg/EjYu4wRD" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-6 py-3 text-sm font-medium text-neutral-200 hover:bg-neutral-700/50 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
          </svg>
          Discord
        </a>
      </div>

      {/* Testimonials Marquee - Zigzag Layout */}
      <div className="space-y-8 relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* First Row - Moving Left (Standard Cards) */}
        <div className="community-marquee community-marquee-left">
          <div className="community-marquee-track">
            {(() => {
              const firstRowTestimonials = [...communityTestimonials.slice(0, 4), ...communityTestimonials.slice(0, 4)];
              return firstRowTestimonials.map((testimonial, idx) => (
                <TestimonialCard key={`row1-${testimonial.id}-${idx}`} testimonial={testimonial} variant="default" />
              ));
            })()}
          </div>
        </div>
        
        {/* Second Row - Moving Right with Offset (Compact Cards) */}
        <div className="community-marquee community-marquee-right" style={{marginLeft: '8rem'}}>
          <div className="community-marquee-track">
            {(() => {
              const secondRowTestimonials = [...communityTestimonials.slice(3, 7), ...communityTestimonials.slice(3, 7)];
              return secondRowTestimonials.map((testimonial, idx) => (
                <TestimonialCard key={`row2-${testimonial.id}-${idx}`} testimonial={testimonial} variant="compact" />
              ));
            })()}
          </div>
        </div>

        {/* Third Row - Moving Left with Different Offset (Wide Cards) */}
        <div className="community-marquee community-marquee-left" style={{marginLeft: '4rem'}}>
          <div className="community-marquee-track">
            {(() => {
              const thirdRowTestimonials = [...communityTestimonials.slice(6, 9), ...communityTestimonials.slice(0, 3), ...communityTestimonials.slice(6, 9), ...communityTestimonials.slice(0, 3)];
              return thirdRowTestimonials.map((testimonial, idx) => (
                <TestimonialCard key={`row3-${testimonial.id}-${idx}`} testimonial={testimonial} variant="wide" />
              ));
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}