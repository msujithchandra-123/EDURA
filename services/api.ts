
import {
  User,
  Role,
  Student,
  Teacher,
  Assignment,
  AssignmentType,
  Submission,
  SubmissionStatus,
  DoubtMessage,
  WorksheetSchema,
} from '../types';
import { geminiService } from './geminiService';

// --- MOCK DATABASE ---

const MOCK_DELAY = 500;

const users: User[] = [
  { id: 'admin-1', role: Role.ADMIN, username: 'admin', name: 'Admin User' },
  { id: 'teacher-1', role: Role.TEACHER, username: 'T001', name: 'Mr. Smith' },
  { id: 'student-1', role: Role.STUDENT, username: 'S001', name: 'Alice' },
  { id: 'student-2', role: Role.STUDENT, username: 'S002', name: 'Bob' },
  { id: 'student-3', role: Role.STUDENT, username: 'S003', name: 'Charlie' },
];

const students: Student[] = [
  { id: 'student-1', role: Role.STUDENT, username: 'S001', name: 'Alice', rollNo: 'S001', class: '5', section: 'A' },
  { id: 'student-2', role: Role.STUDENT, username: 'S002', name: 'Bob', rollNo: 'S002', class: '5', section: 'A' },
  { id: 'student-3', role: Role.STUDENT, username: 'S003', name: 'Charlie', rollNo: 'S003', class: '5', section: 'B' },
];

const teachers: Teacher[] = [
    { id: 'teacher-1', role: Role.TEACHER, username: 'T001', name: 'Mr. Smith', registerNo: 'T001' },
];

const assignments: Assignment[] = [
  {
    id: 'hw-1',
    title: 'Prepositions Video Homework',
    type: AssignmentType.HOMEWORK,
    class: '5',
    section: 'A',
    instructions: 'Record a 30-60 second video where you describe your room using at least 3 prepositions (e.g., in, on, under, next to).',
    createdByTeacherId: 'teacher-1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-1',
    title: 'Grammar Worksheet 1',
    type: AssignmentType.WORKSHEET,
    class: '5',
    section: 'A',
    instructions: 'Complete all parts of the worksheet. Focus on subject-verb agreement and proper noun capitalization.',
    createdByTeacherId: 'teacher-1',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    formSchema: {
      title: "Grammar Worksheet 1",
      instructions: "Complete the sentences and answer the questions.",
      questions: [
        {
          id: 1,
          type: "fill-in-the-blank",
          question: "The cat is sleeping ____ the table."
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Which of these is a correct sentence?",
          options: ["The dogs runs fast.", "The dogs run fast.", "The dogs is running fast."]
        },
        {
          id: 3,
          type: 'true_false',
          question: "'Its' and 'It's' mean the same thing."
        }
      ]
    }
  },
    {
    id: 'ws-2',
    title: 'Vocabulary Worksheet',
    type: AssignmentType.WORKSHEET,
    class: '5',
    section: 'B',
    instructions: 'Fill in the blanks with the correct words from the word bank.',
    createdByTeacherId: 'teacher-1',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let submissions: Submission[] = [
    {
        id: 'sub-hw-1-s2',
        assignmentId: 'hw-1',
        studentId: 'student-2',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: SubmissionStatus.GRADED,
        contentUrl: 'bob_room_tour.mp4',
        feedback: {
            id: 'fb-1',
            submissionId: 'sub-hw-1-s2',
            score: 85,
            summary: 'Great job, Bob! Your video was clear and you used prepositions correctly.',
            detailedFeedback: 'You successfully used "on", "under", and "in". Your pronunciation was very clear. Next time, try to speak a bit more slowly.'
        }
    }
];

let doubtHistory: DoubtMessage[] = [
    { id: 'dh-1', sender: 'ai', message: 'Hello! How can I help you with your studies today?', timestamp: new Date().toISOString() }
];

// --- MOCK API SERVICE ---

export const api = {
  login: async (role: Role, username: string, password: string): Promise<User> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    const user = users.find(u => u.role === role && u.username === username);
    if (user && password === 'password') { // Mock password check
        const fullUser = role === Role.STUDENT 
            ? students.find(s=>s.id === user.id) 
            : (role === Role.TEACHER ? teachers.find(t=>t.id === user.id) : user);
        return Promise.resolve(fullUser!);
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  getStudentAssignments: async (type: 'homework' | 'worksheet'): Promise<Assignment[]> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    return Promise.resolve(assignments.filter(a => a.type === type));
  },

  getTeacherAssignments: async (type: 'homework' | 'worksheet'): Promise<Assignment[]> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
     return Promise.resolve(assignments.filter(a => a.type === type));
  },

  getSubmissionStatuses: async (assignmentIds: string[]): Promise<Record<string, SubmissionStatus>> => {
      // Mock for student-1
    await new Promise(res => setTimeout(res, MOCK_DELAY / 2));
    const statuses: Record<string, SubmissionStatus> = {};
    assignmentIds.forEach(id => {
        const sub = submissions.find(s => s.assignmentId === id && s.studentId === 'student-1');
        statuses[id] = sub ? sub.status : SubmissionStatus.PENDING;
    });
    return Promise.resolve(statuses);
  },

  getDoubtHistory: async (): Promise<DoubtMessage[]> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY / 2));
    return Promise.resolve(doubtHistory);
  },

  getAssignmentById: async (id: string): Promise<Assignment> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      return Promise.resolve(assignment);
    }
    return Promise.reject(new Error('Assignment not found'));
  },

  getSubmissionForAssignment: async (assignmentId: string): Promise<Submission | null> => {
    // Mock for student-1
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    const submission = submissions.find(s => s.assignmentId === assignmentId && s.studentId === 'student-1');
    return Promise.resolve(submission || null);
  },
  
  getSubmissionsForAssignment: async (assignmentId: string): Promise<Submission[]> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    return Promise.resolve(submissions.filter(s => s.assignmentId === assignmentId));
  },

  createSubmission: async (submission: Submission): Promise<Submission> => {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    submissions.push(submission);
    return Promise.resolve(submission);
  },
  
  createAssignment: async (data: Omit<Assignment, 'id' | 'createdByTeacherId' | 'formSchema'> & { pdfFile?: File }): Promise<Assignment> => {
      let formSchema: WorksheetSchema | undefined = undefined;
      
      if(data.type === AssignmentType.WORKSHEET && data.pdfFile) {
        formSchema = await geminiService.convertPdfToForm(data.pdfFile);
      }

      const newAssignment: Assignment = {
          ...data,
          id: `${data.type.slice(0,2)}-${Date.now()}`,
          createdByTeacherId: 'teacher-1', // Mocked teacher
          formSchema: formSchema
      };
      assignments.unshift(newAssignment); // Add to beginning of array
      return Promise.resolve(newAssignment);
  },

  getStudents: async(): Promise<Student[]> => {
      await new Promise(res => setTimeout(res, MOCK_DELAY));
      return Promise.resolve(students);
  },
  
  getTeachers: async(): Promise<Teacher[]> => {
      await new Promise(res => setTimeout(res, MOCK_DELAY));
      return Promise.resolve(teachers);
  }
};