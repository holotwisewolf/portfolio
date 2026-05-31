export default function About() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="crt-text text-2xl font-bold mb-6 border-b border-white pb-2">ABOUT</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p className="opacity-80">
            Developer and trader exploring the intersection of machine learning and financial markets.
            Currently focused on orderflow research and algorithmic trading systems.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {['Python', 'TypeScript', 'React', 'Next.js', 'Machine Learning', 'Trading'].map((skill) => (
              <span key={skill} className="border border-white px-2 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <div className="space-y-1 text-sm">
            <p>GitHub: @yourusername</p>
            <p>Email: your@email.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
