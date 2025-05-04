'use client';

import { useState, useRef, useEffect } from 'react';
import { Course } from '@/types/courses';
import CourseService from '@/apis/courseService';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, Card, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseBasicInfoProps {
  courseId: string;
  initialCourse?: Course;
  onUpdate?: (updatedCourse: Course) => void;
}

export default function CourseBasicInfo({ courseId, initialCourse, onUpdate }: CourseBasicInfoProps) {
  const [course, setCourse] = useState<Course | null>(initialCourse || null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPublicId, setThumbnailPublicId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch course data if not provided
  useEffect(() => {
    if (!initialCourse) {
      fetchCourseData();
    } else {
      setCourse(initialCourse);
      setTitle(initialCourse.title || '');
      setDescription(initialCourse.description || '');
      
      // Lấy thumbnail URL từ course
      if (initialCourse.thumbnail) {
        console.log('Thumbnail URL from initialCourse:', initialCourse.thumbnail);
        setThumbnailUrl(initialCourse.thumbnail);
        
        // Lấy publicId từ initialCourse nếu có
        if (initialCourse.publicId) {
          console.log('Thumbnail publicId from initialCourse:', initialCourse.publicId);
          setThumbnailPublicId(initialCourse.publicId);
        }
      }
    }
  }, [initialCourse, courseId]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const courseData = await CourseService.getCourseInDetail(courseId);
      if (courseData) {
        console.log('Course data from API:', courseData);
        setCourse(courseData);
        setTitle(courseData.title || '');
        setDescription(courseData.description || '');
        
        // Lấy thumbnail URL từ API response
        if (courseData.thumbnail) {
          console.log('Thumbnail URL from API:', courseData.thumbnail);
          setThumbnailUrl(courseData.thumbnail);
          
          // Lấy publicId từ courseData nếu có
          if (courseData.publicId) {
            console.log('Thumbnail publicId from API:', courseData.publicId);
            setThumbnailPublicId(courseData.publicId);
          }
        }
      }
    } catch (error) {
      toast.error('Không thể tải thông tin khóa học');
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    if (!title.trim()) {
      toast.error('Tên khóa học không được để trống');
      return;
    }

    setIsSaving(true);
    try {
      const updatedCourse = await CourseService.updateCourseBasicInfo(courseId, {
        title: title.trim(),
        description: description.trim(),
      });

      if (updatedCourse) {
        setCourse(updatedCourse);
        
        // Cập nhật thumbnail URL từ course mới
        if (updatedCourse.thumbnail) {
          setThumbnailUrl(updatedCourse.thumbnail);
          
          // Cập nhật publicId từ updatedCourse nếu có
          if (updatedCourse.publicId) {
            setThumbnailPublicId(updatedCourse.publicId);
          }
        }
        
        toast.success('Cập nhật thông tin thành công');
        if (onUpdate) onUpdate(updatedCourse);
      }
    } catch (error) {
      toast.error('Không thể cập nhật thông tin khóa học');
      console.error('Error updating course:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Kiểm tra định dạng file
    const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!acceptedFormats.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh định dạng JPEG, PNG, JPG, WEBP');
      return;
    }

    setUploadingThumbnail(true);
    try {
      const result = await CourseService.uploadThumbnail(courseId, file);
      console.log('Upload thumbnail result:', result);
      
      if (result) {
        // Cập nhật state với URL và publicId mới
        setThumbnailUrl(result.thumbnailUrl);
        setThumbnailPublicId(result.publicId);
        console.log('Setting new thumbnail publicId:', result.publicId);
        toast.success('Tải lên ảnh thumbnail thành công');
        
        // Lấy lại thông tin khóa học để cập nhật toàn bộ dữ liệu
        await fetchCourseData();
      } else {
        toast.error('Không thể tải lên ảnh thumbnail. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      if (error?.response?.data?.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Lỗi: ${error.message}`);
      } else {
        toast.error('Không thể tải lên ảnh thumbnail. Vui lòng thử lại sau.');
      }
    } finally {
      setUploadingThumbnail(false);
      // Xóa giá trị input file để người dùng có thể chọn lại file nếu cần
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteThumbnail = async () => {
    if (!thumbnailPublicId) {
      toast.error('Không có ảnh thumbnail để xóa');
      return;
    }

    console.log('Attempting to delete thumbnail with publicId:', thumbnailPublicId);
    
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh thumbnail này?')) return;

    try {
      const isDeleted = await CourseService.deleteCourseImage(courseId, thumbnailPublicId);
      if (isDeleted) {
        setThumbnailUrl('');
        setThumbnailPublicId('');
        toast.success('Xóa ảnh thumbnail thành công');
        
        // Cập nhật lại thông tin khóa học
        await fetchCourseData();
      } else {
        toast.error('Không thể xóa ảnh thumbnail, vui lòng thử lại');
      }
    } catch (error: any) {
      console.error('Error deleting thumbnail:', error);
      if (error?.response?.data?.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Lỗi: ${error.message}`);
      } else {
        toast.error('Không thể xóa ảnh thumbnail. Vui lòng thử lại sau.');
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Đang tải thông tin khóa học...</div>;
  }

  console.log('Rendering with thumbnailUrl:', thumbnailUrl);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Tên khóa học <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên khóa học"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 ký tự - Hãy chọn tên ngắn gọn, hấp dẫn và rõ ràng
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Mô tả khóa học
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn về khóa học"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mô tả nội dung, đối tượng hướng đến và lợi ích của khóa học
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveBasicInfo} disabled={isSaving}>
                {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ảnh thumbnail
              </label>
              
              <div className="border border-dashed border-gray-300 rounded-lg p-4">
                {thumbnailUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full max-w-md mx-auto bg-gray-100">
                      {uploadingThumbnail ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/70 rounded-md">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            <p className="mt-2 text-sm text-gray-700">Đang tải ảnh...</p>
                          </div>
                        </div>
                      ) : null}
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-contain rounded-md"
                        onError={(e) => {
                          console.error('Error loading image:', thumbnailUrl);
                          e.currentTarget.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"%3E%3C/path%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="flex space-x-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingThumbnail}
                      >
                        {uploadingThumbnail ? 'Đang xử lý...' : 'Thay đổi ảnh'}
                      </Button>
                      
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center max-w-md mx-auto relative">
                      {uploadingThumbnail ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/70 rounded-md">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            <p className="mt-2 text-sm text-gray-700">Đang tải ảnh...</p>
                          </div>
                        </div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingThumbnail}
                    >
                      {uploadingThumbnail ? 'Đang tải lên...' : 'Tải lên ảnh thumbnail'}
                    </Button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleThumbnailChange}
                />
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Định dạng: JPEG, PNG, JPG, WEBP. Kích thước tối đa: 5MB. <br />
                Tỷ lệ ảnh đề xuất: 16:9. Kích thước đề xuất: 1280x720 pixels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 