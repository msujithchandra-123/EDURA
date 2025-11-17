export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student'
}

export interface User {
    id: string;
    role: Role;
    username: string; // register_no or roll_no
    name: string;
}

export interface Student extends User {
    rollNo: string;
    class: string;
    section: string;
}

export interface Teacher extends User {
    registerNo: string;
}

export enum AssignmentType {
    HOMEWORK = 'homework',
    WORKSHEET = 'worksheet'
}

export type WorksheetQuestionType = 'fill-in-the-blank' | 'multiple_choice' | 'short_answer' | 'long_answer' | 'true_false';

export interface WorksheetQuestion {
  id: number;
  type: WorksheetQuestionType;
  question: string;
  options?: string[];
  lines?: number;
}

export interface WorksheetSchema {
  title: string;
  instructions: string;
  questions: WorksheetQuestion[];
}

export interface Assignment {
    id: string;
    title: string;
    type: AssignmentType;
    class: string;
    section: string;
    instructions: string;
    createdByTeacherId: string;
    dueDate: string;
    formSchema?: WorksheetSchema;
}

export enum SubmissionStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    GRADED = 'graded'
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    submittedAt: string;
    status: SubmissionStatus;
    contentUrl?: string; // for video/file uploads
    textAnswers?: Record<string, any>; // for worksheets
    feedback?: AIFeedback;
}

export interface AIFeedback {
    id: string;
    submissionId: string;

    score: number;
    summary: string;
    detailedFeedback: string;
}

export interface DoubtMessage {
    id: string;
    sender: 'student' | 'ai';
    message: string;
    timestamp: string;
}

export interface MonthlyScore {
    month: string;
    homeworkScore: number;
    worksheetScore: number;
}