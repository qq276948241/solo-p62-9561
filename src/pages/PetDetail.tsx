import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, Copy, Check, Share2 } from 'lucide-react';
import PhotoSlider from '@/components/PhotoSlider';
import Tag from '@/components/Tag';
import Modal from '@/components/Modal';
import { mockPets } from '@/data/mockPets';

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pet = mockPets.find((p) => p.id === Number(id));

  if (!pet) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">没有找到这只宠物的信息</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-forest text-white rounded-full hover:bg-forest-dark transition-colors duration-200"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleCopyWechat = async () => {
    try {
      await navigator.clipboard.writeText(pet.owner.wechat);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.name} - ${pet.breed}`,
          text: pet.personality,
          url: window.location.href,
        });
      } catch (err) {
        console.error('分享失败', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-cream-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-forest transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <h1 className="text-lg font-bold text-forest">宠物详情</h1>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-cream-dark transition-colors duration-200"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* 照片轮播 */}
          <div className="mb-6">
            <PhotoSlider photos={pet.photos} className="animate-fade-in" />
          </div>

          {/* 宠物信息卡片 */}
          <div className="bg-white rounded-card shadow-card p-6 mb-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{pet.name}</h2>
                  <span className="text-sm px-3 py-1 bg-cream text-forest rounded-full">
                    {pet.species === 'dog' ? '🐕 狗狗' : '🐱 猫咪'}
                  </span>
                </div>
                <p className="text-gray-600">{pet.breed}</p>
              </div>
              <Tag variant={pet.vaccinated ? 'vaccinated' : 'unvaccinated'} className="text-sm">
                {pet.vaccinated ? '✓ 已打疫苗' : '✗ 未打疫苗'}
              </Tag>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-forest" />
                <span>距您 {pet.distance} 米</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-forest" />
                <span>可联系主人</span>
              </div>
            </div>

            {/* 性格描述 */}
            <div className="pt-4 border-t border-cream">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">性格特点</h3>
              <p className="text-gray-600 leading-relaxed">{pet.personality}</p>
            </div>
          </div>

          {/* 主人信息卡片 */}
          <div className="bg-white rounded-card shadow-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">主人信息</h3>
            <div className="flex items-center gap-4">
              <img
                src={pet.owner.avatar}
                alt={pet.owner.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-cream"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{pet.owner.name}</p>
                <p className="text-sm text-gray-500">宠物主人</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-forest bg-cream px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span>在线</span>
              </div>
            </div>
          </div>

          {/* 温馨提示 */}
          <div className="bg-cream-dark/50 rounded-card p-4 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-forest">
              💡 <strong>温馨提示：</strong>请在公共场合牵好宠物绳，文明养宠，共建和谐社区。
            </p>
          </div>
        </div>
      </main>

      {/* 底部联系按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-cream-dark p-4 z-40">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="w-full py-4 bg-forest hover:bg-forest-dark text-white rounded-full font-semibold text-lg transition-all duration-200 active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>联系主人</span>
          </button>
        </div>
      </div>

      {/* 联系方式弹窗 */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="联系主人"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-cream">
            <img
              src={pet.owner.avatar}
              alt={pet.owner.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">{pet.owner.name}</p>
          <p className="text-sm text-gray-500 mb-6">{pet.name} 的主人</p>

          <div className="bg-cream rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">微信号</p>
            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3">
              <span className="font-mono text-lg text-forest font-semibold">
                {pet.owner.wechat}
              </span>
              <button
                onClick={handleCopyWechat}
                className="flex items-center gap-1 px-3 py-1 bg-forest text-white rounded-full text-sm transition-all duration-200 hover:bg-forest-dark"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            点击复制微信号，打开微信搜索添加好友
          </p>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="mt-6 w-full py-3 border-2 border-forest text-forest rounded-full font-medium hover:bg-forest hover:text-white transition-all duration-200"
          >
            知道了
          </button>
        </div>
      </Modal>
    </div>
  );
}
