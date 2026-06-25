const About = () => {
  return (
    <section
      id="about"
      className="bg-[var(--background-dark)]"
      style={{ padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 40px)' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div className="flex items-center justify-center gap-4 mb-[52px]">
          <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
          <h2
            className="text-white font-['Space_Grotesk'] font-bold tracking-[-0.02em] leading-[1.08] text-center"
            style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}
          >
            What we do
          </h2>
          <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        >
          <div className="bg-[#1d2d25] border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[40px] text-[#23a867]">palette</span>
            <h3 className="text-white font-['Space_Grotesk'] text-xl font-bold mt-[18px] mb-[10px]">Creative Sessions</h3>
            <p className="text-[#9ca3af] text-[15px] leading-[1.65]">We regularly host art sessions for people to express their inner artist. These can be 420-friendly experiences if you choose — regardless, all are welcome.</p>
          </div>

          <div className="bg-[#1d2d25] border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[40px] text-[#23a867]">groups</span>
            <h3 className="text-white font-['Space_Grotesk'] text-xl font-bold mt-[18px] mb-[10px]">Community Focus</h3>
            <p className="text-[#9ca3af] text-[15px] leading-[1.65]">Proud members of our local and surrounding communities. Musicians, tattoo artists, comedians, yoga instructors, candle makers — we can accommodate your needs.</p>
          </div>

          <div className="bg-[#1d2d25] border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[40px] text-[#23a867]">local_florist</span>
            <h3 className="text-white font-['Space_Grotesk'] text-xl font-bold mt-[18px] mb-[10px]">Safe Environment</h3>
            <p className="text-[#9ca3af] text-[15px] leading-[1.65]">A clean and professional space for you and your guests. We'll work with you every step of the way to make your event a success.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
