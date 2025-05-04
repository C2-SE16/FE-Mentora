'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2, Pencil, Users, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/types/question';
import { Quiz } from '@/types/quiz';
import QuizService from '@/apis/quizService';
import QuestionService from '@/apis/questionService';
import QuizAttemptService from '@/apis/quizAttemptService';

interface Answer {
  answerId: string;
  questionId: string;
  answerText: string;
  isCorrect: boolean;
  explanation: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface QuestionApiResponse {
  questionId: string;
  quizId: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  orderIndex: number;
  points: number;
  createdAt: string | null;
  updatedAt: string | null;
  tbl_answers: Answer[];
}

interface QuizResponse {
  quizId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  tbl_questions: Array<{
    questionId: string;
    quizId: string;
    questionText: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    orderIndex: number;
    points: number;
    tbl_answers: Array<{
      answerId: string;
      questionId: string;
      answerText: string;
      isCorrect: boolean;
      explanation: string | null;
    }>;
  }>;
  createdAt: string | null;
  updatedAt: string | null;
  curriculumId: string;
  isFree: boolean;
}

interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  status: string;
  score?: number;
  startTime?: number;
  tbl_users?: {
    fullName: string;
    email: string;
  };
}

interface QuizAttemptResponse {
  data: QuizAttempt[];
  statusCode: number;
}

export default function QuizPage() {
  const params = useParams();
  const quizId = params?.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showAttemptsDialog, setShowAttemptsDialog] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [answers, setAnswers] = useState<
    Array<{
      answerText: string;
      isCorrect: boolean;
      explanation?: string | null;
    }>
  >([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState('');
  const [importOptions, setImportOptions] = useState({
    questionSeparator: '\n\n',
    answerSeparator: '\n',
    correctAnswerPrefix: '* ',
  });
  const [tempQuizData, setTempQuizData] = useState<{
    title: string;
    description: string;
    passingScore: number;
    timeLimit: number;
  }>({
    title: '',
    description: '',
    passingScore: 0,
    timeLimit: 0,
  });

  useEffect(() => {
    if (quizId) {
      console.log('Fetching quiz with ID:', quizId);
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz) {
      setTempQuizData({
        title: quiz.title || '',
        description: quiz.description || '',
        passingScore: quiz.passingScore || 0,
        timeLimit: quiz.timeLimit || 0,
      });
    }
  }, [quiz]);

  useEffect(() => {
    if (editingQuestion) {
      setAnswers(
        editingQuestion.answers?.map((a) => ({
          answerText: a.answerText || '',
          isCorrect: a.isCorrect || false,
          explanation: a.explanation || null,
        })) || []
      );
    } else {
      setAnswers([
        { answerText: '', isCorrect: true, explanation: null },
        { answerText: '', isCorrect: false, explanation: null },
      ]);
    }
  }, [editingQuestion]);

  const fetchQuiz = async () => {
    try {
      console.log('Fetching quiz with ID:', quizId);
      const quizData = (await QuizService.getQuizById(quizId)) as QuizResponse;
      console.log('Quiz data received:', quizData);

      if (!quizData) {
        toast.error('Không tìm thấy bài kiểm tra');
        return;
      }

      // Chuyển đổi dữ liệu từ API sang định dạng Quiz
      const normalizedQuizData: Quiz = {
        quizId: quizData.quizId,
        title: quizData.title || '',
        description: quizData.description || '',
        passingScore: quizData.passingScore || 0,
        timeLimit: quizData.timeLimit || 0,
        questions: (quizData.tbl_questions || []).map((q) => ({
          questionId: q.questionId,
          quizId: q.quizId,
          questionText: q.questionText,
          questionType: q.questionType,
          orderIndex: q.orderIndex,
          points: q.points,
          answers: (q.tbl_answers || []).map((a) => ({
            answerId: a.answerId,
            questionId: a.questionId,
            answerText: a.answerText,
            isCorrect: a.isCorrect,
            explanation: a.explanation,
          })),
        })),
        createdAt: quizData.createdAt ? new Date(quizData.createdAt) : null,
        updatedAt: quizData.updatedAt ? new Date(quizData.updatedAt) : null,
        curriculumId: quizData.curriculumId || '',
        isFree: quizData.isFree || false,
      };

      console.log('Normalized quiz data:', normalizedQuizData);
      setQuiz(normalizedQuizData);
    } catch (error: any) {
      console.error('Error fetching quiz:', error);
      toast.error(error.message || 'Không thể tải thông tin bài kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!quiz) return;
    try {
      console.log('quizId', quizId);
      console.log('Updating quiz:', tempQuizData);
      const updatedQuiz = await QuizService.updateQuiz(quizId, tempQuizData);
      console.log('Updated quiz:', updatedQuiz);
      setQuiz(updatedQuiz);
      fetchQuiz();
      toast.success('Cập nhật bài kiểm tra thành công');
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật bài kiểm tra');
    }
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { answerText: '', isCorrect: false, explanation: null }]);
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  const handleUpdateAnswer = (index: number, field: string, value: any) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  const handleCreateQuestion = async (values: {
    questionText?: string;
    questionType?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    points?: number;
  }) => {
    if (!quiz) return;
    try {
      const questionData = {
        quizId,
        questionText: values.questionText || '',
        questionType: values.questionType || 'SINGLE_CHOICE',
        orderIndex: (quiz.questions?.length || 0) + 1,
        points: values.points || 1,
        answers: answers.map((a) => ({
          answerText: a.answerText,
          isCorrect: a.isCorrect,
          explanation: a.explanation,
        })),
      };
      console.log('Question data:', questionData);
      await QuestionService.createQuestion(questionData);
      console.log('Question created successfully');
      await fetchQuiz();
      toast.success('Thêm câu hỏi thành công');
      setShowQuestionForm(false);
      setAnswers([]);
    } catch (error: any) {
      console.error('Error creating question:', error);
      toast.error(error.message || 'Không thể thêm câu hỏi');
    }
  };

  const handleUpdateQuestion = async (values: {
    questionText?: string;
    questionType?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    points?: number;
  }) => {
    if (!editingQuestion) return;
    try {
      console.log('Updating question:', editingQuestion);
      const questionData = {
        questionText: values.questionText || '',
        questionType: values.questionType || 'SINGLE_CHOICE',
        points: values.points || 1,
        answers: answers.map((a) => ({
          answerText: a.answerText,
          isCorrect: a.isCorrect,
          explanation: a.explanation,
        })),
      };
      await QuestionService.updateQuestion(editingQuestion.questionId || '', questionData);
      console.log('Question updated successfully');
      await fetchQuiz();
      toast.success('Cập nhật câu hỏi thành công');
      setShowQuestionForm(false);
      setAnswers([]);
      setEditingQuestion(null);
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast.error(error.message || 'Không thể cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await QuestionService.deleteQuestion(questionId);
      await fetchQuiz();
      toast.success('Xóa câu hỏi thành công');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa câu hỏi');
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await QuizAttemptService.getQuizAttemptsByQuizId(quizId);
      console.log('Attempts data:', response);
      setAttempts(response.data);
    } catch (error: any) {
      console.error('Error fetching attempts:', error);
      toast.error('Không thể tải danh sách bài làm');
    }
  };

  const handleImportQuestions = async () => {
    try {
      await QuestionService.importQuestions({
        text: importText,
        quizId,
        options: importOptions,
      });
      await fetchQuiz();
      toast.success('Import câu hỏi thành công');
      setShowImportDialog(false);
      setImportText('');
    } catch (error: any) {
      toast.error(error.message || 'Không thể import câu hỏi');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!quiz) {
    return <div>Không tìm thấy bài kiểm tra</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bài kiểm tra</h1>
        <Button
          onClick={() => {
            setShowAttemptsDialog(true);
            fetchAttempts();
          }}
        >
          <Users className="w-4 h-4 mr-2" />
          Xem danh sách bài làm
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Thông tin chung</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={tempQuizData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTempQuizData({ ...tempQuizData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingScore">Điểm đạt</Label>
            <Input
              id="passingScore"
              type="number"
              value={tempQuizData.passingScore}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTempQuizData({ ...tempQuizData, passingScore: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeLimit">Thời gian (phút)</Label>
            <Input
              id="timeLimit"
              type="number"
              value={tempQuizData.timeLimit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTempQuizData({ ...tempQuizData, timeLimit: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={tempQuizData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setTempQuizData({ ...tempQuizData, description: e.target.value })
            }
            rows={4}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleUpdateQuiz}>Lưu thay đổi</Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách câu hỏi</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditingQuestion(null);
                setShowQuestionForm(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm câu hỏi
            </Button>
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import câu hỏi
            </Button>
          </div>
        </div>

        {quiz.questions?.map((question) => (
          <div key={question.questionId} className="border p-4 mb-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{question.questionText}</h3>
                <p className="text-gray-500">
                  Loại:{' '}
                  {question.questionType === 'SINGLE_CHOICE'
                    ? 'Chọn một đáp án'
                    : question.questionType === 'MULTIPLE_CHOICE'
                      ? 'Chọn nhiều đáp án'
                      : 'Đúng/Sai'}
                </p>
                <p className="text-gray-500">Điểm: {question.points}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingQuestion(question);
                    setShowQuestionForm(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => question.questionId && handleDeleteQuestion(question.questionId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {question.answers?.map((answer) => (
                <div
                  key={answer.answerId}
                  className={`p-2 rounded ${answer.isCorrect ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  {answer.answerText}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showQuestionForm} onOpenChange={setShowQuestionForm}>
        <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const questionType = formData.get('questionType') as
                | 'SINGLE_CHOICE'
                | 'MULTIPLE_CHOICE'
                | 'TRUE_FALSE';
              const data = {
                questionText: formData.get('questionText') as string,
                questionType: questionType || 'SINGLE_CHOICE',
                points: parseInt(formData.get('points') as string) || 1,
              };
              if (editingQuestion) {
                handleUpdateQuestion(data);
              } else {
                handleCreateQuestion(data);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="questionText">Nội dung câu hỏi</Label>
              <Textarea
                id="questionText"
                name="questionText"
                defaultValue={editingQuestion?.questionText || ''}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionType">Loại câu hỏi</Label>
              <Select
                name="questionType"
                defaultValue={editingQuestion?.questionType || 'SINGLE_CHOICE'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại câu hỏi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_CHOICE">Chọn một đáp án</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">Chọn nhiều đáp án</SelectItem>
                  <SelectItem value="TRUE_FALSE">Đúng/Sai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Điểm</Label>
              <Input
                id="points"
                name="points"
                type="number"
                defaultValue={editingQuestion?.points || 1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Danh sách đáp án</Label>
                <Button type="button" onClick={handleAddAnswer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm đáp án
                </Button>
              </div>
              {answers.map((answer, index) => (
                <div key={index} className="space-y-2 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Đáp án {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAnswer(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={answer.answerText}
                    onChange={(e) => handleUpdateAnswer(index, 'answerText', e.target.value)}
                    placeholder="Nhập nội dung đáp án"
                    rows={2}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={(e) => handleUpdateAnswer(index, 'isCorrect', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label>Đáp án đúng</Label>
                  </div>
                  <Textarea
                    value={answer.explanation || ''}
                    onChange={(e) => handleUpdateAnswer(index, 'explanation', e.target.value)}
                    placeholder="Giải thích (nếu có)"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQuestionForm(false)}>
                Hủy
              </Button>
              <Button type="submit">{editingQuestion ? 'Cập nhật' : 'Thêm'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttemptsDialog} onOpenChange={setShowAttemptsDialog}>
        <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Danh sách bài làm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{attempt.tbl_users?.fullName || 'Người dùng'}</h3>
                    <p className="text-sm text-gray-500">
                      {attempt.tbl_users?.email || 'Chưa có email'}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p>Điểm: {attempt.score || 0}</p>
                      <p>Trạng thái: {attempt.status}</p>
                      {attempt.startTime && (
                        <p>Thời gian bắt đầu: {new Date(attempt.startTime).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {attempts.length === 0 && (
              <p className="text-center text-gray-500">Chưa có ai làm bài kiểm tra này</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import câu hỏi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Định dạng text</Label>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Ví dụ:</p>
                <pre className="bg-gray-100 p-2 rounded">
                  {`Câu 1: Đâu là thủ đô của Việt Nam?
* Hà Nội
Sài Gòn
Đà Nẵng
Hải Phòng

Câu 2: Việt Nam có bao nhiêu tỉnh thành?
* 63
60
65
70`}
                </pre>
                <p>Trong đó:</p>
                <ul className="list-disc pl-5">
                  <li>Phân cách câu hỏi: 2 dòng trống</li>
                  <li>Phân cách đáp án: 1 dòng</li>
                  <li>Đáp án đúng: bắt đầu bằng dấu *</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="importText">Nội dung</Label>
              <Textarea
                id="importText"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={10}
                placeholder="Nhập nội dung câu hỏi theo định dạng trên"
              />
            </div>

            <div className="space-y-2">
              <Label>Tùy chọn phân cách</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionSeparator">Phân cách câu hỏi</Label>
                  <Input
                    id="questionSeparator"
                    value={importOptions.questionSeparator}
                    onChange={(e) =>
                      setImportOptions({
                        ...importOptions,
                        questionSeparator: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answerSeparator">Phân cách đáp án</Label>
                  <Input
                    id="answerSeparator"
                    value={importOptions.answerSeparator}
                    onChange={(e) =>
                      setImportOptions({
                        ...importOptions,
                        answerSeparator: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correctAnswerPrefix">Tiền tố đáp án đúng</Label>
                  <Input
                    id="correctAnswerPrefix"
                    value={importOptions.correctAnswerPrefix}
                    onChange={(e) =>
                      setImportOptions({
                        ...importOptions,
                        correctAnswerPrefix: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleImportQuestions}>Import</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
