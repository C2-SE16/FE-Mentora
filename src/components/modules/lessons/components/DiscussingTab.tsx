import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DiscussingService, { Discussing } from '@/apis/discussingService';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/components/modules/course-detail/components/CommentCard';

interface DiscussingTabProps {
  curriculumId: string;
}

export default function DiscussingTab({ curriculumId }: DiscussingTabProps) {
  const { token } = useAuth();
  const [discussions, setDiscussions] = useState<Discussing[]>([]);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
  });
  const [editingDiscussion, setEditingDiscussion] = useState<Discussing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUserId(decoded.sub);
      } catch (error) {
        console.error('Lỗi khi decode token:', error);
        setCurrentUserId(null);
      }
    } else {
      setCurrentUserId(null);
    }
  }, [token]);

  useEffect(() => {
    fetchDiscussions();
  }, [curriculumId]);

  const fetchDiscussions = async () => {
    try {
      const response = await DiscussingService.getAllByCurriculumId(curriculumId);
      if (response.statusCode === 200 && response.data.statusCode === 200) {
        setDiscussions(response.data.data);
      } else {
        console.error('Lỗi khi lấy danh sách thảo luận:', response.data.message);
        setDiscussions([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thảo luận:', error);
      setDiscussions([]);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    try {
      const discussing = { ...newDiscussion, curriculumId };
      await DiscussingService.createDiscussing(discussing);
      setNewDiscussion({ title: '', content: '' });
      setShowForm(false);
      fetchDiscussions();
    } catch (error) {
      console.error('Lỗi khi tạo thảo luận:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingDiscussion) return;

    setIsLoading(true);
    try {
      const success = await DiscussingService.updateDiscussing(editingDiscussion.discussingId, {
        title: editingDiscussion.title,
        content: editingDiscussion.content,
      });
      if (success) {
        setEditingDiscussion(null);
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thảo luận:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDiscussion = async (discussingId: string) => {
    if (!token) return;

    try {
      const success = await DiscussingService.deleteDiscussing(discussingId);
      if (success) {
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Lỗi khi xóa thảo luận:', error);
    }
  };

  const handleEditClick = (discussion: Discussing) => {
    setEditingDiscussion(discussion);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingDiscussion(null);
  };

  return (
    <div className="space-y-6">
      {/* Danh sách thảo luận */}
      <div className="space-y-4">
        {discussions && discussions.length > 0 ? (
          discussions.map((discussion) => (
            <div key={discussion.discussingId} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={discussion.user.avatar || '/default-avatar.png'}
                      alt={discussion.user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{discussion.title}</h4>
                    <p className="text-sm text-gray-500">
                      {discussion.user.fullName} •{' '}
                      {new Date(discussion.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                {currentUserId && currentUserId === discussion.userId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(discussion)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteDiscussion(discussion.discussingId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-700">{discussion.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">Chưa có thảo luận nào</div>
        )}
      </div>

      {/* Nút tạo thảo luận mới */}
      {token && !editingDiscussion && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={20} />
            {showForm ? 'Đóng' : 'Tạo thảo luận mới'}
          </button>
        </div>
      )}

      {/* Form tạo thảo luận mới */}
      {token && showForm && !editingDiscussion && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tạo thảo luận mới</h3>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Đang tạo...' : 'Tạo thảo luận'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Form sửa thảo luận */}
      {token && editingDiscussion && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sửa thảo luận</h3>
          <form onSubmit={handleUpdateDiscussion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
              <input
                type="text"
                value={editingDiscussion.title}
                onChange={(e) =>
                  setEditingDiscussion({ ...editingDiscussion, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                value={editingDiscussion.content}
                onChange={(e) =>
                  setEditingDiscussion({ ...editingDiscussion, content: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
