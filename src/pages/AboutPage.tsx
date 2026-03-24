import { Github, Mail, MapPin, Book, Code, Coffee } from 'lucide-react';

const skills = [
  { name: 'React / Vue', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 80 },
  { name: 'Python', level: 75 },
  { name: '数据库', level: 75 },
  { name: 'UI/UX 设计', level: 70 },
];

const timeline = [
  {
    year: '2024',
    title: '技术博主',
    description: '开始写博客，分享技术心得和生活感悟',
  },
  {
    year: '2022',
    title: '全栈工程师',
    description: '深入全栈开发，负责多个项目的架构设计',
  },
  {
    year: '2020',
    title: '前端开发',
    description: '专注前端技术，开始接触 React 生态',
  },
  {
    year: '2018',
    title: '毕业',
    description: '计算机专业毕业，正式进入职场',
  },
];

export function AboutPage() {
  return (
    <div className="py-12 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            关于我
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <MapPin size={16} />
            北京
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book size={20} className="text-primary" />
              自我介绍
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                你好！我是，一位热爱技术的开发者。目前专注于前端开发，对 React、TypeScript
                以及现代前端技术栈有深入的研究和实践经验。
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                除了写代码，我也喜欢阅读、写作和咖啡。阅读让我保持思考，写作让我整理思路，而一杯好咖啡则是每天开工的仪式感。
              </p>
              <p className="text-gray-700 leading-relaxed">
                这个博客是我记录技术学习、分享生活感悟的地方。希望这些文字能对你有所启发。
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Code size={20} className="text-primary" />
            技术栈
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.name} className="bg-surface border border-border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Coffee size={20} className="text-primary" />
            时间线
          </h2>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background ring-2 ring-primary/20" />
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-sm text-primary font-medium">{item.year}</span>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6">联系方式</h2>
          <div className="bg-surface border border-border rounded-xl p-6">
            <p className="text-gray-700 mb-4">
              如果你有任何问题、建议或合作意向，欢迎通过以下方式联系我：
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors"
              >
                <Github size={18} />
                GitHub
              </a>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors"
              >
                <Mail size={18} />
                邮箱
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
