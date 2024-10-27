import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AdminUser {
  createdAt: Generated<Timestamp>;
  email: string;
  id: Generated<number>;
  password: string;
  role: Generated<string>;
  updatedAt: Timestamp;
}

export interface Appointment {
  date: Timestamp;
  id: Generated<number>;
  menteeId: string;
  mentorId: string;
  status: Generated<'CANCELED' | 'COMPLETED' | 'CONFIRMED' | 'PENDING'>;
}

export interface Assessment {
  categoryId: number;
  description: string;
  duration: number;
  id: Generated<number>;
  objective: string;
  title: string;
}

export interface Badge {
  icon: string;
  id: Generated<number>;
  message: string;
  name: string;
  receivedDate: Timestamp;
  senderName: string;
  userId: string;
}

export interface BlogPost {
  author: string;
  content: string;
  date: Timestamp;
  id: Generated<number>;
  imagePath: string;
  title: string;
}

export interface Category {
  id: Generated<number>;
  name: string;
}

export interface Certificate {
  assessmentId: number;
  id: Generated<number>;
  issuedAt: Generated<Timestamp>;
  resultId: number;
  url: string;
  userId: string;
}

export interface Chat {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  updatedAt: Timestamp;
}

export interface ChatParticipant {
  chatId: number;
  joinedAt: Generated<Timestamp>;
  userId: string;
}

export interface Comment {
  content: string;
  createdAt: Generated<Timestamp>;
  discussionId: number;
  id: Generated<number>;
}

export interface DevelopmentArea {
  id: Generated<number>;
  name: string;
  userId: string;
}

export interface Discussion {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  title: string;
}

export interface Education {
  degree: string;
  endDate: Timestamp | null;
  fieldOfStudy: string;
  grade: string | null;
  id: Generated<number>;
  institution: string;
  onGoing: boolean;
  startDate: Timestamp;
  userId: string;
}

export interface Experience {
  company: string;
  current: boolean;
  endDate: Timestamp | null;
  id: Generated<number>;
  location: string;
  position: string;
  startDate: Timestamp;
  userId: string;
}

export interface FeatureFlag {
  createdAt: Generated<Timestamp>;
  featureName: string;
  id: Generated<number>;
  isEnabled: Generated<boolean>;
  organizationId: number;
  updatedAt: Timestamp;
}

export interface GetInTouch {
  demo: boolean;
  email: string;
  feedback: boolean;
  firstName: string;
  id: Generated<number>;
  lastName: string;
  message: string;
  question: boolean;
  receivedDate: Timestamp | null;
}

export interface Group {
  description: string | null;
  id: string;
  name: string;
}

export interface GroupMessage {
  content: string;
  createdAt: Generated<Timestamp>;
  groupId: string;
  id: string;
  senderId: string;
}

export interface GroupParticipant {
  groupId: string;
  id: string;
  role: string;
  userId: string;
}

export interface Inquiry {
  id: Generated<number>;
  text: string;
  user: string;
}

export interface MediaRelease {
  description: string;
  href: string;
  id: Generated<number>;
  imagePath: string;
  title: string;
}

export interface MentorFeedback {
  feedback: string;
  id: Generated<number>;
  menteeId: string;
  mentorId: string;
  rating: number;
  receivedDate: Generated<Timestamp>;
}

export interface MentorMentee {
  createdAt: Generated<Timestamp>;
  menteeId: string;
  mentorId: string;
  updatedAt: Timestamp;
}

export interface MentorshipRequest {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  menteeId: string;
  mentorId: string;
  message: string;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  updatedAt: Timestamp;
}

export interface Message {
  chatId: number;
  content: string;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  senderId: string;
}

export interface Milestone {
  endDate: Timestamp;
  id: Generated<number>;
  startDate: Timestamp;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  title: string;
  userId: string;
}

export interface MilestoneStep {
  id: Generated<number>;
  milestoneId: number;
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
}

export interface Option {
  id: Generated<number>;
  isCorrect: boolean;
  questionId: number;
  text: string;
}

export interface Organization {
  contactemail: string | null;
  createdat: Generated<Timestamp>;
  databasename: string | null;
  databaseurl: string;
  domain: string;
  id: Generated<number>;
  isactive: Generated<boolean>;
  organizationname: string;
  subdomain: string | null;
  updatedat: Timestamp;
}

export interface OrganizationLog {
  action: string;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  organizationId: number;
  performedBy: number;
}

export interface Question {
  assessmentId: number;
  id: Generated<number>;
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE';
  text: string;
}

export interface QuizResult {
  assessmentId: number;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  passed: boolean;
  score: number;
  userId: string;
}

export interface Response {
  id: Generated<number>;
  inquiryId: number;
  text: string;
  user: string;
}

export interface Review {
  content: string;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  mentorId: string;
  rating: number;
  userId: string;
}

export interface Skill {
  id: Generated<number>;
  name: string;
  userId: string;
}

export interface SuccessStory {
  content: string;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  isApproved: boolean | null;
  mentorId: string;
  title: string;
  updatedAt: Timestamp;
}

export interface Theme {
  backgroundColor: string;
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  logoUrl: string;
  organizationId: number;
  textColor: string;
  updatedAt: Timestamp;
}

export interface User {
  aboutMe: string | null;
  availability: string | null;
  country: string | null;
  createdAt: Generated<Timestamp>;
  email: string | null;
  id: string;
  isMentee: Generated<boolean>;
  isMentor: Generated<boolean>;
  linkedInProfileLink: string | null;
  menteeInterests: string[] | null;
  mentorAreas: string[] | null;
  name: string;
  overallRating: Generated<number>;
  price: Generated<number>;
  profileBackgroundURL: string | null;
  profilePictureURL: string | null;
  rating: number | null;
  role: Generated<string>;
  specialization: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface UserAnswer {
  assessmentId: number;
  id: Generated<number>;
  isCorrect: boolean;
  questionId: number;
  selectedOptionId: number | null;
  shortAnswerText: string | null;
  userId: string;
}

export interface Video {
  description: string;
  embeddingLink: string;
  id: Generated<number>;
  mentorId: string;
  title: string;
  videoLength: string;
}

export interface DB {
  AdminUser: AdminUser;
  Appointment: Appointment;
  Assessment: Assessment;
  Badge: Badge;
  BlogPost: BlogPost;
  Category: Category;
  Certificate: Certificate;
  Chat: Chat;
  ChatParticipant: ChatParticipant;
  Comment: Comment;
  DevelopmentArea: DevelopmentArea;
  Discussion: Discussion;
  Education: Education;
  Experience: Experience;
  FeatureFlag: FeatureFlag;
  GetInTouch: GetInTouch;
  Group: Group;
  GroupMessage: GroupMessage;
  GroupParticipant: GroupParticipant;
  Inquiry: Inquiry;
  MediaRelease: MediaRelease;
  MentorFeedback: MentorFeedback;
  MentorMentee: MentorMentee;
  MentorshipRequest: MentorshipRequest;
  Message: Message;
  Milestone: Milestone;
  MilestoneStep: MilestoneStep;
  Option: Option;
  Organization: Organization;
  OrganizationLog: OrganizationLog;
  Question: Question;
  QuizResult: QuizResult;
  Response: Response;
  Review: Review;
  Skill: Skill;
  SuccessStory: SuccessStory;
  Theme: Theme;
  User: User;
  UserAnswer: UserAnswer;
  Video: Video;
}
