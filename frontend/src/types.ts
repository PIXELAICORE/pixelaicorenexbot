export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget: string;
  message: string;
  status: 'new' | 'reviewed' | 'contacted' | 'completed';
  createdAt: string;
}

export interface ProjectLead {
  id: string;
  clientUid?: string;
  clientName: string;
  clientEmail: string;
  title: string;
  service: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  package?: string;
  cost?: number;
  description?: string;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  clientUid?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  package: string;
  status: 'approved' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

export interface AgencyService {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  price: string;
}

export interface TestimonialFeedback {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ConsultationBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  timeSlot: string;
  topic: string;
  description?: string;
  paid: boolean;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  createdAt: string;
}

export interface AdminStats {
  totalLeads: number;
  newLeadsCount: number;
  totalRevenue: number;
  projectsCount: number;
  activeProjectsCount: number;
  consultationsCount: number;
  paymentsCount: number;
}
