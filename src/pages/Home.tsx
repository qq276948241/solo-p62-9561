import { useState, useMemo } from 'react';
import { Search, Plus, MapPin, PawPrint } from 'lucide-react';
import PetCard from '@/components/PetCard';
import Modal from '@/components/Modal';
import { mockPets, breeds } from '@/data/mockPets';
import { useFavorites } from '@/hooks/useFavorites';
import type { Pet, FilterType } from '@/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<FilterType>('全部');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedPetOnMap, setSelectedPetOnMap] = useState<Pet | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredPets = useMemo(() => {
    return mockPets
      .filter((pet) => {
        const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBreed = selectedBreed === '全部' || pet.breed === selectedBreed;
        const matchesSpecies = selectedSpecies === 'all' || pet.species === selectedSpecies;
        return matchesSearch && matchesBreed && matchesSpecies;
      })
      .sort((a, b) => {
        const aFav = isFavorite(a.id) ? 0 : 1;
        const bFav = isFavorite(b.id) ? 0 : 1;
        return aFav - bFav;
      });
  }, [searchTerm, selectedBreed, selectedSpecies, isFavorite]);

  const getMarkerColor = (species: 'dog' | 'cat') => {
    return species === 'dog' ? 'bg-forest' : 'bg-amber-500';
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* 顶部搜索栏 */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-cream-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-forest">邻里宠物</h1>
            </div>

            {/* 搜索输入框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索宠物名字或品种..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-cream-dark focus:border-forest focus:outline-none transition-colors duration-200 bg-white"
              />
            </div>

            {/* 品种筛选 */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {breeds.map((breed) => (
                <button
                  key={breed}
                  onClick={() => setSelectedBreed(breed)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedBreed === breed
                      ? 'bg-forest text-white'
                      : 'bg-white text-gray-600 hover:bg-cream-dark'
                  }`}
                >
                  {breed}
                </button>
              ))}
            </div>

            {/* 发布按钮 */}
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-dark text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>发布</span>
            </button>
          </div>

          {/* 物种筛选 */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-600">筛选：</span>
            {[
              { value: 'all', label: '全部' },
              { value: 'dog', label: '🐕 狗狗' },
              { value: 'cat', label: '🐱 猫咪' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedSpecies(item.value as 'all' | 'dog' | 'cat')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSpecies === item.value
                    ? 'bg-cream-dark text-forest'
                    : 'text-gray-500 hover:text-forest'
                }`}
              >
                {item.label}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-500">
              共找到 <span className="text-forest font-semibold">{filteredPets.length}</span> 只宠物
            </span>
          </div>
        </div>
      </header>

      {/* 主体内容 - 地图 + 列表 */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧地图区域 */}
          <div className="lg:w-1/2 h-[500px] bg-white rounded-card shadow-card overflow-hidden relative">
            {/* 地图背景 */}
            <div className="absolute inset-0 bg-cream/50">
              {/* 模拟地图网格 */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E8D5BC" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* 模拟道路 */}
              <div className="absolute top-1/3 left-0 right-0 h-4 bg-cream-dark/50" />
              <div className="absolute top-2/3 left-0 right-0 h-4 bg-cream-dark/50" />
              <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-cream-dark/50" />
              <div className="absolute left-2/3 top-0 bottom-0 w-4 bg-cream-dark/50" />

              {/* 中心点 - 用户位置 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center shadow-lg animate-pulse-soft">
                    <span className="text-white text-lg">📍</span>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-forest bg-white px-2 py-1 rounded shadow">
                    我的位置
                  </div>
                </div>
              </div>

              {/* 宠物标记点 */}
              {filteredPets.map((pet) => (
                <div
                  key={pet.id}
                  style={{
                    left: `${pet.location.x}%`,
                    top: `${pet.location.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onClick={() => setSelectedPetOnMap(pet)}
                >
                  <div className={`relative ${selectedPetOnMap?.id === pet.id ? 'scale-125' : ''} transition-transform duration-200`}>
                    <div className={`w-10 h-10 ${getMarkerColor(pet.species)} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-white text-sm">
                        {pet.species === 'dog' ? '🐕' : '🐱'}
                      </span>
                    </div>
                    <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${selectedPetOnMap?.id === pet.id ? 'opacity-100' : ''}`}>
                      {pet.name} · {pet.distance}米
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 地图标题 */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-forest" />
                <span className="text-sm font-medium text-gray-700">附近宠物分布</span>
              </div>
            </div>

            {/* 图例 */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-md">
              <p className="text-xs text-gray-500 mb-2">图例</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-forest rounded-full" />
                  <span className="text-xs text-gray-600">狗狗</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full" />
                  <span className="text-xs text-gray-600">猫咪</span>
                </div>
              </div>
            </div>

            {/* 选中宠物的卡片预览 */}
            {selectedPetOnMap && (
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg animate-fade-in">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPetOnMap.avatar}
                    alt={selectedPetOnMap.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cream"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{selectedPetOnMap.name}</h4>
                    <p className="text-sm text-gray-500">{selectedPetOnMap.breed}</p>
                    <p className="text-xs text-forest mt-1">距离 {selectedPetOnMap.distance} 米</p>
                  </div>
                  <button
                    onClick={() => setSelectedPetOnMap(null)}
                    className="px-4 py-2 bg-forest text-white rounded-full text-sm font-medium hover:bg-forest-dark transition-colors duration-200"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右侧列表区域 */}
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">附近的宠物伙伴</h2>
              <span className="text-sm text-gray-500">横向滑动查看更多 →</span>
            </div>

            {/* 横向滑动列表 */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {filteredPets.length > 0 ? (
                  filteredPets.map((pet, index) => (
                    <div
                      key={pet.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PetCard pet={pet} />
                    </div>
                  ))
                ) : (
                  <div className="w-full py-16 text-center">
                    <p className="text-gray-500">没有找到符合条件的宠物</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedBreed('全部');
                        setSelectedSpecies('all');
                      }}
                      className="mt-4 text-forest hover:underline"
                    >
                      清除筛选条件
                    </button>
                  </div>
                )}
              </div>

              {/* 左右渐变遮罩 */}
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-cream to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-cream to-transparent pointer-events-none" />
            </div>

            {/* 所有宠物网格（下方显示更多） */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">全部宠物</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPets.map((pet, index) => (
                  <div
                    key={pet.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PetCard pet={pet} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 发布弹窗 */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="发布宠物信息"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">宠物名字</label>
            <input
              type="text"
              placeholder="请输入宠物名字"
              className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark focus:border-forest focus:outline-none transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">宠物品种</label>
            <select className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark focus:border-forest focus:outline-none transition-colors duration-200 bg-white">
              <option>请选择品种</option>
              <option>金毛犬</option>
              <option>柴犬</option>
              <option>萨摩耶</option>
              <option>英短蓝猫</option>
              <option>中华田园猫</option>
              <option>其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">物种</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="species" value="dog" className="text-forest" />
                <span>🐕 狗狗</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="species" value="cat" className="text-forest" />
                <span>🐱 猫咪</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">疫苗状态</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="vaccinated" value="yes" className="text-forest" />
                <span>已打疫苗</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="vaccinated" value="no" className="text-forest" />
                <span>未打疫苗</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性格描述</label>
            <textarea
              rows={3}
              placeholder="描述一下宠物的性格特点..."
              className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark focus:border-forest focus:outline-none transition-colors duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">微信号</label>
            <input
              type="text"
              placeholder="请输入您的微信号"
              className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark focus:border-forest focus:outline-none transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-xl font-medium transition-all duration-200 active:scale-98"
          >
            发布
          </button>
        </form>
      </Modal>
    </div>
  );
}
