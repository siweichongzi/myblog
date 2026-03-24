import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Save, Eye, ArrowLeft, X, Upload, Image } from 'lucide-react';
import {
  createArticle,
  updateArticle,
  loadArticles,
  generateSlug,
  estimateReadingTime,
} from '../data/store';
import { MarkdownRenderer } from '../components/blog';

const ALL_TAGS = ['技术', 'React', '前端', '设计', '读书', '生活', '随笔', '教程'];
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB

export function ArticleEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('# 开始写作\n\n在这里写你的 Markdown 内容...');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 编辑模式：加载已有文章
  useEffect(() => {
    if (isEdit && id) {
      const article = loadArticles().find((a) => a.id === id);
      if (article) {
        setTitle(article.title);
        setSummary(article.summary);
        setContent(article.content);
        setSelectedTags(article.tags);
        setCoverImage(article.coverImage || '');
      }
    }
  }, [id, isEdit]);

  // 处理图片上传 -> base64
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('请选择图片文件'));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        reject(new Error(`图片太大（${(file.size / 1024).toFixed(0)}KB），请控制在 500KB 以内`));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('读取图片失败'));
      reader.readAsDataURL(file);
    });
  };

  // 封面上传
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    try {
      const base64 = await processImageFile(file);
      setCoverImage(base64);
    } catch (err: any) {
      setImageError(err.message);
    }
    // 清空 input，允许重复选择同一文件
    e.target.value = '';
  };

  // 拖拽封面上传
  const handleCoverDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setImageError('');
    try {
      const base64 = await processImageFile(file);
      setCoverImage(base64);
    } catch (err: any) {
      setImageError(err.message);
    }
  };

  // 编辑器内插入图片
  const insertImage = async (file: File) => {
    try {
      const base64 = await processImageFile(file);
      const imageMarkdown = `\n![${file.name}](${base64})\n`;
      setContent((prev) => prev + imageMarkdown);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 编辑器粘贴图片（textarea + document 双重监听，确保捕获）
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await insertImage(file);
        break;
      }
    }
  };

  // 全局 document 级别粘贴监听
  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) await insertImage(file);
          break;
        }
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, []);

  // 编辑器拖拽图片
  const handleEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      e.preventDefault();
      e.stopPropagation();
      await insertImage(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = tagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setTagInput('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入文章标题');
      return;
    }
    if (!content.trim()) {
      alert('请输入文章内容');
      return;
    }

    setSaving(true);
    try {
      const articleData = {
        title: title.trim(),
        summary: summary.trim() || title.trim(),
        content: content.trim(),
        tags: selectedTags,
        coverImage: coverImage.trim() || undefined,
        slug: isEdit
          ? loadArticles().find((a) => a.id === id)?.slug || generateSlug(title)
          : generateSlug(title),
        publishedAt: new Date().toISOString().slice(0, 10),
        readingTime: estimateReadingTime(content),
      };

      if (isEdit && id) {
        updateArticle(id, articleData);
      } else {
        createArticle(articleData);
      }

      navigate('/admin');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium text-gray-600">
          {isEdit ? '编辑文章' : '写新文章'}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => setPreview(!preview)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            preview
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eye size={16} />
          {preview ? '编辑' : '预览'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? '保存中...' : '发布文章'}
        </button>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="文章标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl md:text-3xl font-serif font-bold bg-transparent border-none outline-none text-gray-900 placeholder-gray-300"
        />

        {/* Summary */}
        <input
          type="text"
          placeholder="文章摘要（可选，留空则使用标题）"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full text-base bg-transparent border-none outline-none text-gray-500 placeholder-gray-300"
        />

        {/* Cover Image - 支持上传 + URL 两种方式 */}
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <Image size={14} />
            封面图片
            <span className="text-xs text-gray-400 font-normal">（支持本地上传，也支持填写网络 URL）</span>
          </div>

          {/* 图片预览区 */}
          {coverImage ? (
            <div className="relative rounded-xl overflow-hidden mb-2 group">
              <img
                src={coverImage}
                alt="封面预览"
                className="w-full h-48 object-cover"
                onError={() => {
                  setCoverImage('');
                  setImageError('图片加载失败，请检查 URL 或重新上传');
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Upload size={14} />
                  更换图片
                </button>
                <button
                  onClick={() => setCoverImage('')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                  移除
                </button>
              </div>
            </div>
          ) : (
            /* 上传区域 */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleCoverDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <Upload size={24} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                拖拽图片到这里，或 <span className="text-primary font-medium">点击选择文件</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">支持 JPG/PNG/GIF/WebP，建议不超过 500KB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />

          {/* 网络 URL 备用 */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="或者直接粘贴图片 URL..."
              value={coverImage.startsWith('data:') ? '' : coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="flex-1 text-sm bg-gray-50 border border-border rounded-lg px-4 py-2 outline-none focus:border-primary transition-colors placeholder-gray-400"
            />
            {coverImage && !coverImage.startsWith('data:') && (
              <button
                onClick={() => setCoverImage('')}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="清除 URL"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 错误提示 */}
          {imageError && (
            <p className="text-xs text-red-500 mt-1">{imageError}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {/* Custom tag input */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="添加自定义标签..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              className="text-sm bg-gray-50 border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary transition-colors placeholder-gray-400 w-48"
            />
            <button
              onClick={addCustomTag}
              className="text-sm px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              添加
            </button>
            {/* Show selected custom tags */}
            {selectedTags.filter((t) => !ALL_TAGS.includes(t)).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-accent/20 text-gray-700 rounded-full text-sm"
              >
                {tag}
                <button onClick={() => toggleTag(tag)} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* 图片插入提示 */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">Ctrl</kbd>+
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">V</kbd>
            {' '}粘贴图片
          </span>
          <span>拖拽图片到编辑器</span>
          <span>或使用工具栏插入</span>
        </div>

        {/* Editor / Preview */}
        {preview ? (
          <div className="min-h-[400px]">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <div
            data-color-mode="light"
            className="flex-1"
            onDrop={handleEditorDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={600}
              preview="edit"
              hideToolbar={false}


              textareaProps={{
                onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
                  handlePaste(e);
                },
                onDrop: (e: React.DragEvent<HTMLTextAreaElement>) => {
                  const file = e.dataTransfer?.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    e.preventDefault();
                    e.stopPropagation();
                    insertImage(file);
                  }
                },
              }}
              style={{ borderRadius: '12px', border: '1px solid #e8e8e6' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
