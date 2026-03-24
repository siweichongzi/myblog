import type { Article } from '../types';

export const articles: Article[] = [
  {
    id: '1',
    slug: 'react-best-practices-2024',
    title: 'React 最佳实践：构建可维护的大型应用',
    summary: '探讨在大型 React 项目中如何组织代码结构、管理状态、优化性能，以及团队协作的最佳实践。',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['技术', 'React', '前端'],
    publishedAt: '2024-03-15',
    readingTime: 12,
    content: `
# React 最佳实践：构建可维护的大型应用

在现代前端开发中，React 已经成为构建复杂用户界面的首选框架。然而，随着项目规模的增长，如何保持代码的可维护性和可扩展性成为了每个团队必须面对的挑战。

## 1. 组件设计原则

### 单一职责原则

每个组件应该只负责一个功能。如果一个组件变得过于复杂，应该将其拆分成更小的组件。

\`\`\`tsx
// 好的实践：职责分离
function UserProfile({ userId }) {
  const { user, loading } = useUser(userId);
  const { posts } = useUserPosts(userId);

  if (loading) return <Skeleton />;
  
  return (
    <div>
      <UserHeader user={user} />
      <UserBio bio={user.bio} />
      <UserPosts posts={posts} />
    </div>
  );
}
\`\`\`

### Props 接口设计

始终为组件定义清晰的 TypeScript 接口，这不仅有助于开发时的类型检查，也能作为组件的文档。

\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
\`\`\`

## 2. 状态管理策略

### 状态的位置

不是所有的状态都需要放在全局状态管理器中。遵循以下原则：

- **组件状态**：仅在该组件内部使用
- **Context**：跨多层组件共享的状态
- **全局状态管理器**（Zustand/Redux）：跨多个页面或功能模块共享的状态

### 自定义 Hooks

将可复用的逻辑提取到自定义 Hooks 中，这是 React 开发中最重要的最佳实践之一。

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

## 3. 性能优化

### React.memo 和 useMemo

合理使用 memoization 可以避免不必要的重新渲染：

\`\`\`tsx
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem key={item.id} {...item} />);
});

function Parent() {
  const processedItems = useMemo(() => 
    items.map(processItem), 
    [items]
  );
  
  return <ExpensiveList items={processedItems} />;
}
\`\`\`

## 4. 项目结构

推荐采用**功能模块化**的组织方式：

\`\`\`
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   ├── dashboard/
│   └── settings/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── app/
\`\`\`

## 结语

React 开发的最佳实践不是一成不变的规则，而是需要根据团队和项目的实际情况灵活应用。希望本文能为你提供一些有价值的参考。

> "The best code is no code at all. The second best code is the code that is easy to delete."
> — Jeff Atwood
`
  },
  {
    id: '2',
    slug: 'the-art-of-reading',
    title: '阅读的艺术：在信息碎片化时代保持深度思考',
    summary: '在快节奏的现代生活中，如何重新找回深度阅读的习惯，让阅读成为滋养心灵的慢时光。',
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80',
    tags: ['读书', '随笔', '生活'],
    publishedAt: '2024-03-10',
    readingTime: 8,
    content: `
# 阅读的艺术：在信息碎片化时代保持深度思考

清晨的阳光透过窗帘洒在书桌上，手边一杯温热的茶，这是我认为一天中最美好的时刻。

## 被碎片化的时间

我们每天被海量的信息包围：朋友圈的动态、短视频的推送、邮件的提醒......这些碎片化的信息像潮水一样涌来，让我们习惯了**快速浏览**而非**深度阅读**。

> 心理学家把这种现象称为"注意力分散障碍"（Attention Deficit Trait），它正在悄悄改变我们的大脑。

## 为什么深度阅读仍然重要

1. **构建深度思考能力**：长篇文章和书籍需要持续的注意力，这正是深度思考的基础
2. **建立知识体系**：碎片化学习只能获取零散的知识点，系统阅读才能构建完整的知识框架
3. **提升同理心**：通过阅读他人的故事，我们能够理解不同的处境和观点

## 我的阅读方法

### 1. 固定阅读时间

我每天早上6点到7点是雷打不动的阅读时间。这个时间段头脑清醒，没有工作的压力，最适合阅读需要思考的书籍。

### 2. 带着问题阅读

在翻开一本书之前，我会先问自己：
- 我想从这本书中获得什么？
- 我对这个主题已经有了哪些了解？
- 哪些部分需要重点关注？

### 3. 做读书笔记

好记性不如烂笔头。我会记录：
- 精彩的段落和语句
- 自己的思考和感悟
- 与其他知识的关联

### 4. 定期回顾

每月抽出一天时间，回顾本月读过的书籍，整理笔记，加深记忆。

## 推荐书单

今年读过的几本好书：

| 书名 | 作者 | 类别 |
|------|------|------|
| 《百年孤独》 | 加西亚·马尔克斯 | 文学 |
| 《思考，快与慢》 | 丹尼尔·卡尼曼 | 心理学 |
| 《有限与无限的游戏》 | 詹姆斯·卡斯 | 哲学 |

## 结语

阅读不是任务，而是一种生活方式。当你真正爱上阅读，你会发现世界变得更加宽广，心灵变得更加充实。

让我们在这个喧嚣的时代，守住一片宁静的阅读空间。
`
  },
  {
    id: '3',
    slug: 'how-to-write-technical-blog',
    title: '如何写好技术博客：从入门到精通',
    summary: '分享我写技术博客的经验和心得，包括选题、写作技巧、文章结构，以及如何让技术文章既有深度又易读。',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    tags: ['教程', '技术', '设计'],
    publishedAt: '2024-03-05',
    readingTime: 15,
    content: `
# 如何写好技术博客：从入门到精通

写技术博客是程序员最好的学习方式之一。通过写作，我们能够：
- 梳理自己的知识体系
- 加深对技术的理解
- 帮助他人，同时提升自己

## 为什么要写技术博客？

### 1. 费曼学习法

> "If you can't explain it simply, you don't understand it well enough."
> — Albert Einstein

当你试图向他人解释一个概念时，你会发现自己的理解是否真正透彻。写作就是这种"解释"的最佳形式。

### 2. 构建个人品牌

高质量的技术博客能够帮助你：
- 建立专业形象
- 拓展职业机会
- 连接志同道合的朋友

## 如何开始

### 第一步：克服心理障碍

很多程序员觉得自己写得不够好，不敢发布。这是最需要克服的心理障碍。

记住：**写得烂比不写强100倍**。

### 第二步：确定选题

好的选题应该满足以下条件之一：
- 你刚刚学会一项新技术
- 你解决了一个棘手的问题
- 你对某个话题有独特的见解

### 第三步：规划文章结构

一篇好的技术文章通常包含以下部分：

\`\`\`
1. 引言：介绍背景和问题
2. 核心内容：详细讲解
3. 代码示例：实际演示
4. 总结：归纳要点
5. 扩展阅读：推荐相关资源
\`\`\`

## 写作技巧

### 1. 使用类比

技术概念往往抽象，类比能够帮助读者理解：

> "变量就像一个盒子，我们在盒子上贴上标签（变量名），在里面放东西（值）。"

### 2. 图文并茂

适当使用图表和代码块，能让文章更易读：

\`\`\`javascript
// 代码示例
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('World'));
\`\`\`

### 3. 控制段落长度

长段落会增加阅读负担。每个段落不超过3-4句话，复杂的观点应该分成多个段落。

## 持续改进

写博客是一个需要持续练习的技能。我的建议是：

1. **保持更新**：每周至少写一篇
2. **接受反馈**：欢迎读者的批评和建议
3. **复盘改进**：定期回顾自己的文章，找出不足

## 结语

开始写吧！现在就开始写你的第一篇博客。不要等到"准备充分"才开始，因为那一天永远不会到来。

祝写作愉快！
`
  },
  {
    id: '4',
    slug: 'minimalist-lifestyle',
    title: '极简主义生活：少即是多的智慧',
    summary: '分享我践行极简主义生活方式的心得，如何通过减少物质的束缚，获得精神的自由。',
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
    tags: ['生活', '随笔', '设计'],
    publishedAt: '2024-02-28',
    readingTime: 6,
    content: `
# 极简主义生活：少即是多的智慧

两年前，我搬进了一套40平米的小公寓。正是这次搬家，让我开始思考：**我们真的需要那么多东西吗？**

## 我的极简主义之旅

### 从断舍离开始

搬家时，我发现自己的物品竟然装满了两辆货车。这个数字让我震惊不已。

于是我开始执行"断舍离"：

- **断**：不需要的东西坚决不买
- **舍**：多余的东西果断舍弃
- **离**：脱离对物质的执念

### 极简后的变化

经过一年的实践，我的生活发生了明显的变化：

1. **空间更宽敞**：40平米的空间，住出了80平米的感觉
2. **时间更充裕**：不再为整理和寻找物品浪费时间
3. **心情更轻松**：物质负担减少，精神压力也随之降低
4. **更清楚自己真正需要什么**：在减少的过程中，发现什么是真正重要的

## 极简主义的几个原则

### 1. 一进一出

每购入一件新物品，就淘汰一件旧物品。保持物品总量不增加。

### 2. 24小时法则

想买的东西，先放购物车24小时。如果24小时后仍然想买，再买。很多时候，冲动消费的欲望会在24小时内消失。

### 3. 质量重于数量

与其买10件便宜的衣服，不如买1件高品质的。质量好的东西更耐用，也更能让人珍惜。

### 4. 数字极简

除了物质极简，我也实践了数字极简：
- 取消不重要的订阅
- 删除长期不用的App
- 清理社交媒体的好友列表

## 极简不等于空无一物

需要强调的是，**极简主义不是苦行僧式的生活**。

极简主义的目的是：
- 减少无意义的消耗
- 专注于真正重要的事物
- 获得内心的平静和自由

如果你珍视某样东西，完全可以保留它。极简的关键是**有意识地选择**，而不是简单地"少"。

## 写在最后

极简主义不是终点，而是一种持续的生活方式。在这个物欲横流的时代，能守住内心的清明，本身就是一种智慧。

**少即是多**。愿我们都能拥有轻盈的生活。
`
  },
  {
    id: '5',
    slug: 'typescript-advanced-patterns',
    title: 'TypeScript 高级模式：提升代码质量的进阶技巧',
    summary: '深入探讨 TypeScript 中的条件类型、映射类型、模板字面量类型等高级特性，以及如何在项目中应用。',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['技术', '前端', '教程'],
    publishedAt: '2024-02-20',
    readingTime: 18,
    content: `
# TypeScript 高级模式：提升代码质量的进阶技巧

TypeScript 不仅仅是 JavaScript 的类型化扩展，更是一门强大的类型编程语言。本文将探讨一些 TypeScript 高级特性，帮助你写出更健壮的代码。

## 1. 条件类型

条件类型让我们能够根据输入类型推导出输出类型：

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
\`\`\`

### 实际应用：Promise 类型提取

\`\`\`typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>;  // string
type B = UnwrapPromise<number>;            // number
\`\`\`

## 2. 映射类型

映射类型让我们可以批量转换类型的属性：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

### 创建实用类型

\`\`\`typescript
// 将所有属性转为可选
type User = { id: number; name: string; email: string };
type PartialUser = Partial<User>;

// 将所有属性转为只读
type ReadonlyUser = Readonly<User>;

// 将所有属性转为字符串类型
type Stringify<T> = {
  [P in keyof T]: string;
};
type StringifiedUser = Stringify<User>;
\`\`\`

## 3. 模板字面量类型

TypeScript 4.1 引入了模板字面量类型：

\`\`\`typescript
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`;
// Handler = 'onClick' | 'onFocus' | 'onBlur'
\`\`\`

### 实际应用：CSS 属性生成

\`\`\`typescript
type Size = 'small' | 'medium' | 'large';
type Color = 'primary' | 'secondary';

type ClassName = \`\${Size}-\${Color}\`;
// "small-primary" | "small-secondary" | "medium-primary" | ...
\`\`\`

## 4. 递归类型

TypeScript 支持递归类型定义：

\`\`\`typescript
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type A = Flatten<[[1, 2], [3, 4]]>;  // 1 | 2 | 3 | 4
type B = Flatten<string>;            // string
\`\`\`

## 5. 工具类型最佳实践

\`\`\`typescript
// 从 T 中选取 K
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 从 T 中排除 K
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 将 T 的属性合并到默认属性 D 上
type Override<T, D> = Omit<D, keyof T> & T;
\`\`\`

## 总结

TypeScript 的类型系统非常强大，善用这些高级特性可以：
- 捕获更多运行时错误
- 提供更好的 IDE 支持
- 让代码更加自文档化

但也要注意：**类型不应该成为过度工程的借口**。在可读性和类型安全性之间找到平衡才是关键。
`
  }
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getArticlesByTag = (tag: string): Article[] => {
  return articles.filter(article => 
    article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
};

export const searchArticles = (query: string): Article[] => {
  const lowerQuery = query.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.summary.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
