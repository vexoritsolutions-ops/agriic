import React, { useState, useEffect, useRef } from 'react';
import {
  Leaf,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Star,
  Phone,
  FileText,
  ShieldCheck,
  User,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  MessageCircle,
  Plus,
  Minus,
  Trash2,
  Lock,
  Search,
  BookOpen,
  Calendar,
  Clock,
  HelpCircle,
  Award,
  Globe,
  MapPin,
  Check,
  ChevronDown,
  Package,
  Truck,
  CreditCard,
  Camera,
  Mail,
  Bell,
  BarChart2,
  Tag,
  ShoppingBag,
  Store,
  XCircle,
  Sprout,
  Recycle,
  Droplet,
  FlaskConical,
  TrendingUp,
  Factory,
  Coins,
  Users,
  HandHeart,
  Shield
} from 'lucide-react';
import { Product, Order, BlogPost, Testimonial, Ingredient, GoogleReview, Expectation, QuizQuestion } from './types';

import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  linkWithPhoneNumber,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from "./lib/firebase";
import { seedDatabaseIfEmpty, SEED_PRODUCTS } from "./initialData";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

import { HomeModule } from "./components/HomeModule";
import { FarmersModule } from "./components/FarmersModule";
import { SoilModule } from "./components/SoilModule";
import { NutritionModule } from "./components/NutritionModule";
import { ProductsModule } from "./components/ProductsModule";
import { AnalyticsModule } from "./components/AnalyticsModule";
import { ConsultationsModule } from "./components/ConsultationsModule";
import { ContentModule } from "./components/ContentModule";
import { SupportModule } from "./components/SupportModule";
import { SettingsModule } from "./components/SettingsModule";
import { ShopModule } from "./components/ShopModule";
import { TrustSections } from "./components/TrustSections";
import {
  Farmer,
  SoilReport,
  DeficiencyAlertRule,
  NutritionPlan,
  SupportTicket,
  DashboardActivity,
  WorkspaceSettings,
  Consultation,
  ContentItem,
  UserRole
} from "./types";

// Custom router helper
const getHashParams = (hashStr: string) => {
  const parts = hashStr.split('?');
  const path = parts[0] || '#home';
  const query = parts[1] || '';
  const params: Record<string, string> = {};
  if (query) {
    query.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value || '');
    });
  }
  return { path, params };
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#home');
  const [heroSlide, setHeroSlide] = useState(0);
  const [productTab, setProductTab] = useState<'fertilizer' | 'seeds' | 'gardening'>('fertilizer');
  const [allProductsSearch, setAllProductsSearch] = useState('');
  const [allProductsPage, setAllProductsPage] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activePlanIndex, setActivePlanIndex] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentHash = window.location.hash || '#home';
      if (currentHash === '#home') {
        setHeroSlide(prev => (prev + 1) % 3);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll Best Sellers horizontally
    const timer = setInterval(() => {
      if (bestSellersRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = bestSellersRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          bestSellersRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          bestSellersRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 3500); // Scroll every 3.5 seconds
    return () => clearInterval(timer);
  }, []);

  const pricingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Auto-scroll Pricing Cards horizontally
    const timer = setInterval(() => {
      if (pricingRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = pricingRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          pricingRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          pricingRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 2000); // Scroll every 2 seconds
    return () => clearInterval(timer);
  }, []);
  // ==========================================
  // DYNAMIC ADMIN STATE & DATABASE CONTROLS
  // ==========================================
  const [adminActiveTab, setAdminActiveTab] = useState<string>('home');
  const [liveFarmers, setLiveFarmers] = useState<Farmer[]>([]);
  const [liveSoilReports, setLiveSoilReports] = useState<SoilReport[]>([]);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [liveAlertRules, setLiveAlertRules] = useState<DeficiencyAlertRule[]>([]);
  const [liveNutritionPlans, setLiveNutritionPlans] = useState<NutritionPlan[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [liveConsultations, setLiveConsultations] = useState<Consultation[]>([]);
  const [liveContent, setLiveContent] = useState<ContentItem[]>([]);
  const [liveTickets, setLiveTickets] = useState<SupportTicket[]>([]);
  const [liveActivities, setLiveActivities] = useState<DashboardActivity[]>([]);
  const [liveSettings, setLiveSettings] = useState<WorkspaceSettings | null>(null);
  const [liveBlogPosts, setLiveBlogPosts] = useState<BlogPost[]>([]);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);
  const [liveIngredients, setLiveIngredients] = useState<Ingredient[]>([]);
  const [liveGoogleReviews, setLiveGoogleReviews] = useState<GoogleReview[]>([]);
  const [liveExpectations, setLiveExpectations] = useState<Expectation[]>([]);
  const [liveQuizQuestions, setLiveQuizQuestions] = useState<QuizQuestion[]>([]);


  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: UserRole; uid?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('agriic_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Automated first-run seed trigger  // Initial component mount
  useEffect(() => {
    // Push all products to Firestore (merge so existing data is preserved)
    const upsertNewProducts = async () => {
      try {
        for (const p of SEED_PRODUCTS) {
          await setDoc(doc(db, 'products', p.id), p, { merge: true });
        }
      } catch (e) {
        // Silently ignore — e.g. if offline or not authenticated
      }
    };
    upsertNewProducts();
  }, []);

  // Sync state machine on Firebase Auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let assignedRole: UserRole = 'Farmer';
        let assignedName = user.displayName || 'Authorized User';
        let phone = '';
        let location = '';
        let cropType = '';
        let landSize = '';
        let profileImage = '';

        if (user.email === 'abhiirana2031@gmail.com') {
          assignedRole = 'Super Admin';
        }

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) assignedRole = data.role as UserRole;
            if (data.name) assignedName = data.name;
            if (data.phone) phone = data.phone;
            if (data.location) location = data.location;
            if (data.cropType) cropType = data.cropType;
            if (data.landSize) landSize = data.landSize;
            if (data.profileImage) profileImage = data.profileImage;
          } else {
            // If user doesn't exist in Firestore, create a default profile
            const freshUser = {
              id: user.uid,
              name: assignedName,
              email: user.email || "",
              role: assignedRole,
              joinedAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", user.uid), freshUser);
          }
        } catch (e) {
          console.error("Error fetching user role", e);
        }

        const session = {
          email: user.email || '',
          name: assignedName,
          role: assignedRole,
          uid: user.uid
        };

        if (assignedRole === 'Super Admin') {
          setAdminUser(session);
          localStorage.setItem('agriic_admin_session', JSON.stringify(session));
        } else {
          setAdminUser(null);
          localStorage.removeItem('agriic_admin_session');
        }

        setCurrentUser({
          id: user.uid,
          name: assignedName,
          email: user.email || '',
          phone: phone,
          role: assignedRole,
          location: location,
          cropType: cropType,
          landSize: landSize,
          profileImage: profileImage
        });
      } else {
        setAdminUser(null);
        setCurrentUser(null);
        localStorage.removeItem('agriic_admin_session');
      }
    });
    return () => unsub();
  }, []);

  // Live Snapshot synchronizers
  useEffect(() => {

    const u1 = onSnapshot(collection(db, "users"), (snapshot) => {
      const fList: Farmer[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        fList.push({
          id: doc.id,
          name: d.name || 'Anonymous Grower',
          email: d.email || '',
          phone: d.phone || '',
          role: d.role || 'Farmer',
          location: d.location || '',
          cropFocus: d.cropFocus || '',
          landSize: d.landSize || '',
          status: d.status || 'Active',
          joinedAt: d.joinedAt || new Date().toISOString()
        });
      });
      setLiveFarmers(fList);
    }, (err) => handleLiveSyncError(err, 'list', 'users'));

    const u2 = onSnapshot(collection(db, "soilReports"), (snapshot) => {
      const sList: SoilReport[] = [];
      snapshot.forEach(doc => {
        sList.push({ id: doc.id, ...doc.data() } as SoilReport);
      });
      setLiveSoilReports(sList);
    }, (err) => handleLiveSyncError(err, 'list', 'soilReports'));

    const u3 = onSnapshot(collection(db, "orders"), (snapshot) => {
      const oList: Order[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        oList.push({ id: doc.id, ...d } as Order);
      });
      setLiveOrders(oList);
    }, (err) => handleLiveSyncError(err, 'list', 'orders'));

    const u4 = onSnapshot(collection(db, "deficiencyRules"), (snapshot) => {
      const rList: DeficiencyAlertRule[] = [];
      snapshot.forEach(doc => {
        rList.push({ id: doc.id, ...doc.data() } as DeficiencyAlertRule);
      });
      setLiveAlertRules(rList);
    }, (err) => handleLiveSyncError(err, 'list', 'deficiencyRules'));

    const u5 = onSnapshot(collection(db, "nutritionPlans"), (snapshot) => {
      const pList: NutritionPlan[] = [];
      snapshot.forEach(doc => {
        pList.push({ id: doc.id, ...doc.data() } as NutritionPlan);
      });
      setLiveNutritionPlans(pList);
    }, (err) => handleLiveSyncError(err, 'list', 'nutritionPlans'));

    const u6 = onSnapshot(collection(db, "products"), (snapshot) => {
      const prList: Product[] = [];
      snapshot.forEach(doc => {
        prList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setLiveProducts(prList);
    }, (err) => handleLiveSyncError(err, 'list', 'products'));

    const u7 = onSnapshot(collection(db, "consultations"), (snapshot) => {
      const cList: Consultation[] = [];
      snapshot.forEach(doc => {
        cList.push({ id: doc.id, ...doc.data() } as Consultation);
      });
      setLiveConsultations(cList);
    }, (err) => handleLiveSyncError(err, 'list', 'consultations'));

    const u8 = onSnapshot(collection(db, "content"), (snapshot) => {
      const cnList: ContentItem[] = [];
      snapshot.forEach(doc => {
        cnList.push({ id: doc.id, ...doc.data() } as ContentItem);
      });
      setLiveContent(cnList);
    }, (err) => handleLiveSyncError(err, 'list', 'content'));

    const u9 = onSnapshot(collection(db, "supportTickets"), (snapshot) => {
      const tList: SupportTicket[] = [];
      snapshot.forEach(doc => {
        tList.push({ id: doc.id, ...doc.data() } as SupportTicket);
      });
      setLiveTickets(tList);
    }, (err) => handleLiveSyncError(err, 'list', 'supportTickets'));

    const u10 = onSnapshot(collection(db, "activities"), (snapshot) => {
      const actList: DashboardActivity[] = [];
      snapshot.forEach(doc => {
        actList.push({ id: doc.id, ...doc.data() } as DashboardActivity);
      });
      setLiveActivities(actList);
    }, (err) => handleLiveSyncError(err, 'list', 'activities'));

    const u11 = onSnapshot(doc(db, "settings", "global_workspace"), (doc) => {
      if (doc.exists()) {
        setLiveSettings(doc.data() as WorkspaceSettings);
      }
    }, (err) => handleLiveSyncError(err, 'get', 'settings/global_workspace'));
    const u12 = onSnapshot(collection(db, "blogPosts"), (snapshot) => {
      const list: BlogPost[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as BlogPost));
      setLiveBlogPosts(list);
    });
    const u13 = onSnapshot(collection(db, "testimonials"), (snapshot) => {
      const list: Testimonial[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Testimonial));
      setLiveTestimonials(list);
    });
    const u14 = onSnapshot(collection(db, "ingredients"), (snapshot) => {
      const list: Ingredient[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Ingredient));
      setLiveIngredients(list);
    });
    const u15 = onSnapshot(collection(db, "googleReviews"), (snapshot) => {
      const list: GoogleReview[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as GoogleReview));
      setLiveGoogleReviews(list);
    });
    const u16 = onSnapshot(collection(db, "expectations"), (snapshot) => {
      const list: Expectation[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Expectation));
      setLiveExpectations(list);
    });
    const u17 = onSnapshot(collection(db, "quizQuestions"), (snapshot) => {
      const list: QuizQuestion[] = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as QuizQuestion));
      setLiveQuizQuestions(list);
    });


    return () => {
      if (typeof u1 === 'function') u1();
      if (typeof u2 === 'function') u2();
      if (typeof u3 === 'function') u3();
      if (typeof u4 === 'function') u4();
      if (typeof u5 === 'function') u5();
      if (typeof u6 === 'function') u6();
      if (typeof u7 === 'function') u7();
      if (typeof u8 === 'function') u8();
      if (typeof u9 === 'function') u9();
      if (typeof u10 === 'function') u10();
      if (typeof u11 === 'function') u11();
      if (typeof u12 === 'function') u12();
      if (typeof u13 === 'function') u13();
      if (typeof u14 === 'function') u14();
      if (typeof u15 === 'function') u15();
      if (typeof u16 === 'function') u16();
      if (typeof u17 === 'function') u17();
    };
  }, [adminUser]);

  // Error handling compliance mapper
  function handleLiveSyncError(error: unknown, opType: string, path: string) {
    const errObj = {
      error: error instanceof Error ? error.message : String(error),
      auth: {
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email
      },
      operationType: opType,
      path: path
    };
    console.error("Firestore sync error: ", JSON.stringify(errObj));
  }

  // Live Actions mapped directly to Firestore writes
  const handleClearActivities = async () => {
    try {
      for (const act of liveActivities) {
        await deleteDoc(doc(db, "activities", act.id));
      }
      showToastMsg("Cleared historical audit logs.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', 'activities');
    }
  };

  const handleUpdateFarmerRole = async (id: string, role: string) => {
    try {
      await updateDoc(doc(db, "users", id), { role });
      showToastMsg(`Role assigned successfully: ${role}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `users/${id}`);
    }
  };

  const handleUpdateFarmerStatus = async (id: string, status: 'Active' | 'Suspended') => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      showToastMsg(`Grower login state switched to: ${status}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `users/${id}`);
    }
  };

  const handleReviewSoilReport = async (id: string, action: string) => {
    try {
      await updateDoc(doc(db, "soilReports", id), {
        status: "Reviewed",
        actionTaken: action
      });
      showToastMsg("Manual diagnosis review committed to database.");
    } catch (e) {
      handleLiveSyncError(e, 'update', `soilReports/${id}`);
    }
  };

  const handleUploadSoilReport = async (report: any) => {
    try {
      const newId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        id: newId,
        ...report,
        status: "Pending",
        actionTaken: "",
        uploadDate: new Date().toISOString().split('T')[0]
      };
      await setDoc(doc(db, "soilReports", newId), payload);
      showToastMsg(`Successfully registered Soil Analysis report ${newId}`);
    } catch (e) {
      handleLiveSyncError(e, 'create', 'soilReports');
    }
  };

  const handleAddAlertRule = async (rule: any) => {
    try {
      const newId = `RULE-${Date.now()}`;
      await setDoc(doc(db, "deficiencyRules", newId), { id: newId, ...rule });
      showToastMsg("Biochemical deficiency warning rule saved.");
    } catch (e) {
      handleLiveSyncError(e, 'create', 'deficiencyRules');
    }
  };

  const handleToggleAlertRule = async (id: string, active: boolean) => {
    try {
      await updateDoc(doc(db, "deficiencyRules", id), { active });
    } catch (e) {
      handleLiveSyncError(e, 'update', `deficiencyRules/${id}`);
    }
  };

  const handleDeleteAlertRule = async (id: string) => {
    try {
      await deleteDoc(doc(db, "deficiencyRules", id));
      showToastMsg("Custom threshold warning rule removed.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `deficiencyRules/${id}`);
    }
  };

  const handleAddPlan = async (plan: any) => {
    try {
      const newId = `PLAN-${Date.now()}`;
      await setDoc(doc(db, "nutritionPlans", newId), { id: newId, ...plan });
      showToastMsg("Botanical formulation template successfully logged.");
    } catch (e) {
      handleLiveSyncError(e, 'create', 'nutritionPlans');
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deleteDoc(doc(db, "nutritionPlans", id));
      showToastMsg("Formulation plan template deleted.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `nutritionPlans/${id}`);
    }
  };

  const handleAddProductAdmin = async (prod: any) => {
    try {
      const newId = `prod_new_${Date.now()}`;
      await setDoc(doc(db, "products", newId), { id: newId, ...prod });
      showToastMsg(`New catalog product "${prod.name}" successfully registered.`);
    } catch (e) {
      handleLiveSyncError(e, 'create', 'products');
    }
  };

  const handleEditProductStock = async (id: string, newStock: number) => {
    try {
      await updateDoc(doc(db, "products", id), { stock: Number(newStock) });
    } catch (e) {
      handleLiveSyncError(e, 'update', `products/${id}`);
    }
  };

  const handleDeleteProductAdmin = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showToastMsg("Catalog product removed from inventory registry.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `products/${id}`);
    }
  };

  const handleUpdateOrderStatusAdmin = async (id: string, nextStatus: any) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: nextStatus });
      showToastMsg(`Advanced order process to: ${nextStatus}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `orders/${id}`);
    }
  };

  const handleAddConsultation = async (consult: any) => {
    try {
      const newId = `CON-${Math.floor(1000 + Math.random() * 9000)}`;
      await setDoc(doc(db, "consultations", newId), { id: newId, ...consult });
      showToastMsg("Fitted advisor slot successfully booked.");
    } catch (e) {
      handleLiveSyncError(e, 'create', 'consultations');
    }
  };

  const handleCompleteConsultation = async (id: string, notes: string) => {
    try {
      await updateDoc(doc(db, "consultations", id), {
        notes,
        status: "Completed"
      });
      showToastMsg("Session marked Completed; advisory records committed.");
    } catch (e) {
      handleLiveSyncError(e, 'update', `consultations/${id}`);
    }
  };

  const handlePublishArticle = async (article: any) => {
    try {
      const newId = `ART-${Date.now()}`;
      const payload = {
        id: newId,
        ...article,
        publishedAt: new Date().toISOString(),
        targetPushSent: false
      };
      await setDoc(doc(db, "content", newId), payload);
      showToastMsg(`Broadcasted article: ${article.title}`);
    } catch (e) {
      handleLiveSyncError(e, 'create', 'content');
    }
  };

  const handleTriggerSMSPush = async (id: string) => {
    try {
      await updateDoc(doc(db, "content", id), { targetPushSent: true });
      showToastMsg("Push notification payload transmitted via cellular gateway.");
    } catch (e) {
      handleLiveSyncError(e, 'update', `content/${id}`);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(db, "content", id));
      showToastMsg("Scientific report deleted.");
    } catch (e) {
      handleLiveSyncError(e, 'delete', `content/${id}`);
    }
  };

  const handleAddTicketMessage = async (ticketId: string, text: string, isInternal: boolean) => {
    try {
      const tRef = doc(db, "supportTickets", ticketId);
      const tSnap = await getDoc(tRef);
      if (tSnap.exists()) {
        const ticketData = tSnap.data() as SupportTicket;
        const msg = {
          id: "msg-" + Date.now(),
          sender: isInternal ? "STAFF NOTE" : "Agronomist Operator",
          text: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInternal: isInternal
        };
        const updatedMsgs = [...ticketData.messages, msg];
        await updateDoc(tRef, { messages: updatedMsgs });
        showToastMsg("Grower helpdesk chat dispatched.");
      }
    } catch (e) {
      handleLiveSyncError(e, 'update', `supportTickets/${ticketId}`);
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: any) => {
    try {
      await updateDoc(doc(db, "supportTickets", id), { status });
      showToastMsg(`Helpdesk ticket marked: ${status}`);
    } catch (e) {
      handleLiveSyncError(e, 'update', `supportTickets/${id}`);
    }
  };

  const handleSaveSettings = async (setts: any) => {
    try {
      await setDoc(doc(db, "settings", "global_workspace"), setts);
      showToastMsg("Saved application gateways and notification configs.");
    } catch (e) {
      handleLiveSyncError(e, 'write', 'settings/global_workspace');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // If we are in signup mode, we must require phone number
      if (authMode === 'signup') {
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        if (!userDoc.exists()) {
          setTempGoogleUser(result.user);
          setAuthMode('phone_verify');
          setupRecaptcha();
          return;
        }
      }

      showToastMsg(`Google authentication successful.`);
      window.location.hash = '#profile';
    } catch (error) {
      console.error("Google authentication failed:", error);
      showToastMsg("Google authentication pop-up was closed or failed.");
    }
  };

  const handleAdminEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, 'abhiirana2031@gmail.com', authPassword);
      showToastMsg(`Admin authentication successful.`);
    } catch (error: any) {
      console.error("Email authentication failed:", error);
      let errMsg = error.message || "Email authentication failed.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errMsg = "invalid pass";
      } else if (error.code === 'auth/invalid-email') {
        errMsg = "email";
      } else if (error.code === 'auth/user-not-found') {
        errMsg = "not found";
      }
      showToastMsg(errMsg);
    }
  };

  const handleAdminSignOut = async () => {
    try {
      await signOut(auth);
      showToastMsg("Admin console session terminated safely.");
    } catch {
      console.error("Logout failed.");
    }
  };
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>(() => {
    try {
      const saved = localStorage.getItem('agriic_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('agriic_orders');
      return saved ? JSON.parse(saved) : liveOrders;
    } catch {
      return liveOrders;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriic_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const toastTimeoutRef = React.useRef<any>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Timeline Tab State
  const [timelineTab, setTimelineTab] = useState<'vegetable' | 'ornamental'>('vegetable');

  // Auth Mode
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'phone_verify' | 'forgot_password'>('login');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpCode, setOtpCode] = useState('');
  const [tempGoogleUser, setTempGoogleUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<{ id?: string; email: string; name?: string; phone?: string; location?: string; cropType?: string; landSize?: string; role?: string; profileImage?: string; } | null>(() => {
    try {
      const saved = localStorage.getItem('agriic_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLocation, setAuthLocation] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCropType, setEditCropType] = useState('Vegetables & Herbs');
  const [editLandSize, setEditLandSize] = useState('Backyard (5-10 Pots)');

  // Profile Image State
  const [profileImage, setProfileImage] = useState<string>(() => {
    try {
      return localStorage.getItem('agriic_profile_image') || '';
    } catch {
      return '';
    }
  });

  // Invoice Modal State
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [invoiceEmailType, setInvoiceEmailType] = useState<'visual' | 'code'>('visual');
  const [invoiceSending, setInvoiceSending] = useState(false);

  // Checkout Form State
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutFullname, setCheckoutFullname] = useState('');
  const [checkoutStreet, setCheckoutStreet] = useState('');
  const [checkoutPincode, setCheckoutPincode] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutState, setCheckoutState] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Ref for picking file
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditLocation(currentUser.location || '');
      setEditCropType(currentUser.cropType || 'Vegetables & Herbs');
      setEditLandSize(currentUser.landSize || 'Backyard (5-10 Pots)');
      setProfileImage(currentUser.profileImage || '');
    } else {
      setEditName('Alok Patel');
      setEditEmail('alok.patel@agrimail.in');
      setEditPhone('9845012345');
      setEditLocation('Maharashtra');
      setEditCropType('Vegetables & Herbs');
      setEditLandSize('Backyard (5-10 Pots)');
    }
  }, [currentUser]);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Shop Filter
  const [productFilter, setProductFilter] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Blog News Letter
  const [newsEmail, setNewsEmail] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  // Accordion Details Active Key
  const [openAccordion, setOpenAccordion] = useState<string | null>('benefits');

  // Checkout Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  // Counter simulation on landing page
  const [farmersCount, setFarmersCount] = useState(0);
  const [resultsPct, setResultsPct] = useState(0);
  const [ratingVal, setRatingVal] = useState(0);

  // Parse hash and params
  const { path: routePath, params: routeParams } = getHashParams(hash);

  // Sync profile details to checkout when entering checkout page
  useEffect(() => {
    if (routePath === '#checkout') {
      setCheckoutEmail(currentUser?.email || editEmail || '');
      setCheckoutPhone(currentUser?.phone || editPhone || '');
      setCheckoutFullname(currentUser?.name || editName || '');
      setCheckoutState(currentUser?.location || editLocation || '');
    }
  }, [routePath, currentUser, editEmail, editPhone, editName, editLocation]);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#home');
      window.scrollTo(0, 0);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('agriic_cart', JSON.stringify(cart));
  }, [cart]);

  // Stat Counter Animation
  useEffect(() => {
    if (routePath === '#home') {
      const timer = setTimeout(() => {
        setFarmersCount(5); // Simulate 5L+
        setResultsPct(98);  // 98%
        setRatingVal(4.7);  // 4.7
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [routePath]);

  const showToastMsg = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
    setTimeout(() => {
      setToast(msg);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
    }, 40);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].qty += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product, qty: quantity }]);
    }
    showToastMsg(`${quantity}x ${product.name} added to cart!`);
    setIsCartDrawerOpen(true);
  };

  const updateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
      showToastMsg(`Item removed from cart.`);
    } else {
      setCart(cart.map(item => item.product.id === productId ? { ...item, qty: newQty } : item));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('agriic_cart');
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, authPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      showToastMsg('OTP sent to your phone!');
    } catch (error: any) {
      console.error(error);
      showToastMsg('Failed to send OTP. Make sure phone number includes country code (+91).');
    }
  };

  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (confirmationResult && tempGoogleUser) {
        // First, link the phone credential to the current user
        await linkWithPhoneNumber(tempGoogleUser, authPhone, window.recaptchaVerifier);
        // We do not need to confirm because linkWithPhoneNumber handles the OTP if we pass it... wait!
        // Actually, confirmationResult is from signInWithPhoneNumber! If we use signInWithPhoneNumber, we can't easily link.
        // But if we just want to force them to prove they own the phone, and we already know their Google uid:
        // Wait, for simplicity: we already have tempGoogleUser!
        // We can just confirm the OTP and if successful, they are authenticated via Phone. We can just create their profile!
        // But Firebase will create a NEW uid for the Phone Auth.
        // Let's just create the user profile under the Google UID and log them in!
        // Wait, if they confirm OTP, `auth.currentUser` becomes the Phone Auth user.
        // So we will just use that UID!
        const result = await confirmationResult.confirm(otpCode);

        const freshUser = {
          id: result.user.uid,
          name: tempGoogleUser.displayName || authName.trim() || 'Alok Patel',
          email: tempGoogleUser.email || '',
          phone: authPhone.trim(),
          role: 'Farmer' as UserRole,
          location: authLocation.trim() || 'Maharashtra',
          cropType: 'Vegetables & Herbs',
          landSize: 'Backyard (5-10 Pots)',
          joinedAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", result.user.uid), freshUser);
        showToastMsg('Account created successfully!');
        window.location.hash = '#profile';
      } else if (confirmationResult && authMode === 'forgot_password') {
        await confirmationResult.confirm(otpCode);
        showToastMsg('Logged in via Mobile OTP!');
        window.location.hash = '#profile';
      }
    } catch (error: any) {
      console.error(error);
      showToastMsg('Invalid OTP Code.');
    }
  };

  const handleForgotPasswordEmail = async () => {
    if (!authEmail) {
      showToastMsg('Please enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, authEmail);
      showToastMsg('Password reset link sent to your email.');
    } catch (error: any) {
      console.error(error);
      showToastMsg(error.message);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        showToastMsg('Welcome back to Agriic!');
        window.location.hash = '#profile';
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errMsg = error.message || "Authentication failed";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errMsg = "invalid pass";
      } else if (error.code === 'auth/invalid-email') {
        errMsg = "email";
      } else if (error.code === 'auth/user-not-found') {
        errMsg = "not found";
      }
      showToastMsg(errMsg);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToastMsg('Logged out successfully.');
      window.location.hash = '#home';
    } catch {
      console.error("Logout failed");
    }
  };

  const saveUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const updatedUser = {
        name: editName.trim() || currentUser?.name || 'Alok Patel',
        phone: editPhone.trim() || currentUser?.phone || '9845012345',
        location: editLocation.trim() || currentUser?.location || 'Maharashtra',
        cropType: editCropType,
        landSize: editLandSize
      };

      await updateDoc(doc(db, "users", auth.currentUser.uid), updatedUser);
      setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : prev);
      showToastMsg('Grower Profile updated and synchronized successfully!');
    } catch (e) {
      console.error("Profile update error", e);
      showToastMsg("Failed to update profile.");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && auth.currentUser) {
      if (file.size > 2 * 1024 * 1024) {
        showToastMsg('Image is too large! Please choose an image smaller than 2MB.');
        return;
      }
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;

          setProfileImage(base64String);
          localStorage.setItem('agriic_profile_image', base64String);

          await updateDoc(doc(db, "users", auth.currentUser!.uid), { profileImage: base64String });
          setCurrentUser(prev => prev ? { ...prev, profileImage: base64String } : prev);
          showToastMsg('Profile avatar updated successfully!');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image update failed", error);
        showToastMsg('Failed to update image.');
      }
    } else if (file) {
      showToastMsg('You must be logged in to upload an avatar.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    try {
      await updateDoc(doc(db, "orders", orderId), { status: 'Cancelled' });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      showToastMsg('Order cancelled successfully.');
    } catch (e) {
      console.error(e);
      showToastMsg('Failed to cancel order.');
    }
  };

  const generateEmailTemplate = (order: Order): string => {
    const itemRows = order.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7;">
          <div style="display: flex; align-items: center;">
            <img src="${item.img || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'}" style="width: 40px; height: 40px; border-radius: 8px; margin-right: 12px; object-fit: cover;" />
            <div>
              <div style="font-weight: bold; color: #2D5A3F; font-size: 14px;">${item.name}</div>
              <div style="color: #666; font-size: 11px;">ID: ${item.productId}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7; text-align: center; color: #2D5A3F; font-weight: bold;">
          ${item.qty}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7; text-align: right; color: #2D5A3F; font-family: monospace;">
          ₹${item.price}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e1d7; text-align: right; color: #2D5A3F; font-weight: bold; font-family: monospace;">
          ₹${item.price * item.qty}
        </td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Agriic Order Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #fcfbf7; margin: 0; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e1d7; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="background-color: #2D5A3F; padding: 24px; text-align: center; border-bottom: 4px solid #D4A373;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">Agriic<span style="color: #D4A373;">.</span></h1>
      <p style="color: #D4A373; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 5px 0 0 0; font-weight: bold;">Order Purchase Receipt</p>
    </div>
    <div style="padding: 24px;">
      <h2 style="color: #2D5A3F; margin-top: 0; font-size: 18px;">Grower Dispatch Invoice</h2>
      <p style="color: #555; font-size: 13px; line-height: 1.5;">
        Dear Grower, your organic order formulation has been processed. Here is the verified dynamic digital tax invoice showing active botanical dispatches.
      </p>
      <div style="background-color: #f7f6ee; border-radius: 8px; padding: 12px; margin: 20px 0; border-left: 4px solid #2D5A3F; font-size: 12px;">
        <table style="width: 100%;">
          <tr><td style="color: #666; padding: 2px 0;"><strong>Invoice ID:</strong></td><td style="color: #2D5A3F; text-align: right; font-weight: bold;">${order.id}</td></tr>
          <tr><td style="color: #666; padding: 2px 0;"><strong>Issue Date:</strong></td><td style="color: #2D5A3F; text-align: right;">${order.date}</td></tr>
          <tr><td style="color: #666; padding: 2px 0;"><strong>Shipping Destination:</strong></td><td style="color: #2D5A3F; text-align: right;">${order.address}</td></tr>
          <tr><td style="color: #666; padding: 2px 0;"><strong>Billing Method:</strong></td><td style="color: #2D5A3F; text-align: right; text-transform: uppercase;">${order.paymentMethod}</td></tr>
        </table>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px;">
        <thead>
          <tr style="background-color: #2D5A3F; color: #ffffff; text-align: left;">
            <th style="padding: 8px;">Active Formulation</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Rate</th>
            <th style="padding: 8px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px 8px 2px 8px; text-align: right; color: #666;">Shipping charges:</td>
            <td style="padding: 10px 8px 2px 8px; text-align: right; color: #2D5A3F; font-weight: bold; font-family: monospace;">
              ${order.total >= 499 ? '₹0 (Gratis)' : '₹49'}
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 2px 8px 10px 8px; text-align: right; color: #2D5A3F; font-size: 14px; font-weight: bold; border-top: 1px solid #2D5A3F;">Grand Total:</td>
            <td style="padding: 2px 8px 10px 8px; text-align: right; color: #2D5A3F; font-size: 15px; font-weight: bold; font-family: monospace; border-top: 1px solid #2D5A3F;">
              ₹${order.total}
            </td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top: 25px; text-align: center; border-top: 1px dashed #e2e1d7; padding-top: 15px;">
        <p style="color: #2D5A3F; font-size: 11px; font-weight: bold; margin: 0;">90-DAY ROOT & SOIL BIOME HEALTH GUARANTEE</p>
        <p style="color: #666; font-size: 10px; margin: 4px 0 0 0; line-height: 1.4;">
          Your formulation has been packed and sealed under temperature control. Thank you for cultivating with Agriic.
        </p>
      </div>
    </div>
    <div style="background-color: #f7f6ee; padding: 15px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #e2e1d7;">
      <p style="margin: 0;">© 2026 Agriic Solutions Private Limited.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  // Navigation Links array
  const navLinks: { label: string; href: string; icon?: React.ReactNode }[] = [
    { label: 'Home', href: '#home' },
    { label: 'Science', href: '#science' },
    { label: 'Shop', href: '#products', icon: <Store className="w-4 h-4 mr-1.5 inline-block" /> },
    { label: 'Soil Test™', href: '#soil-test' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-display bg-white text-agri-charcoal relative">

      {/* Toast Notification */}
      {toast && (
        <>
          <style>{`
            @keyframes toastSlideDown {
              0% { transform: translate(-50%, -24px); opacity: 0; }
              100% { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes toastShrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
            .animate-toast-slide-in {
              animation: toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-toast-progress {
              animation: toastShrink 3000ms linear forwards;
            }
          `}</style>
          <div className="fixed top-24 left-1/2 z-50 bg-[#2b3a30] text-white px-5 py-3.5 rounded-xl border border-[#D4A373]/35 shadow-2.5xl flex flex-col overflow-hidden animate-toast-slide-in backdrop-blur-md min-w-[280px] sm:min-w-[345px]">
            <div className="flex items-center space-x-3 mb-2.5">
              <CheckCircle className="w-4.5 h-4.5 text-[#D4A373] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast}</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-[#D4A373] h-full animate-toast-progress" />
            </div>
          </div>
        </>
      )}

      {/* Floating Header */}
      {routePath !== '#products' && (
        routePath === '#product' ? (
          <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8 py-3 flex flex-col rounded-b-[24px] text-slate-800">
            <div className="flex items-center justify-between gap-4 w-full">
              {/* Logo */}
              <a href="#products" className="flex items-center shrink-0 group">
                <img src="/logo2.jpeg" alt="Agriic Logo" className="h-10 w-auto object-contain rounded-md shadow-sm group-hover:opacity-90 transition-opacity" />
              </a>

              {/* Location Selector */}
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-gray-200 text-xs shrink-0 text-slate-600">
                <MapPin className="w-4 h-4 text-[#2D5A3F]" />
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-gray-400 font-bold uppercase leading-none">Location</span>
                  <span className="font-extrabold text-slate-700 leading-tight">Delhi, India</span>
                </div>
              </div>

              {/* Search Bar with All Categories dropdown */}
              <div className="flex-1 max-w-xl relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-28 py-2 border border-gray-200 rounded-full text-xs bg-slate-50 placeholder-gray-450 font-semibold focus:outline-none focus:bg-white focus:border-[#2D5A3F] focus:ring-2 focus:ring-[#2D5A3F]/20 transition-all"
                  placeholder="Search Spices, Flour, Grains..."
                  value={allProductsSearch}
                  onChange={(e) => setAllProductsSearch(e.target.value)}
                />
                <div className="absolute right-1 top-1 bottom-1 flex items-center">
                  <select
                    className="bg-transparent text-[10px] font-bold text-slate-600 border-l border-gray-200 pl-2 pr-6 py-1 mr-1 focus:outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%25234A5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-[right_8px_center] bg-no-repeat"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="grains-millet">Grains & Millets</option>
                    <option value="rice-poha">Rice & Poha</option>
                    <option value="dals-pulses">Dals & Pulses</option>
                    <option value="seeds">Seeds</option>
                    <option value="salt-spices">Spices & Salt</option>
                    <option value="flours-sooji">Flours & Sooji</option>
                    <option value="sweeteners">Sweeteners</option>
                    <option value="ghee-oils">Ghee & Oils</option>
                  </select>
                </div>
              </div>

              {/* Login & Cart */}
              <div className="flex items-center space-x-3 text-xs shrink-0">
                <a
                  href="#cart"
                  onClick={(e) => { e.preventDefault(); setIsCartDrawerOpen(true); }}
                  className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center text-[#2D5A3F]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#2D5A3F] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {getCartCount()}
                    </span>
                  )}
                </a>

                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <a
                      href="#profile"
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-slate-50 border border-gray-200 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#2D5A3F]" />
                      <span className="hidden sm:inline font-bold text-[10px]">{currentUser.name || 'Alok'}</span>
                    </a>
                    <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 hover:underline">
                      Exit
                    </button>
                  </div>
                ) : (
                  <a href="#auth" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-slate-700 hover:bg-slate-50 font-bold transition-all text-[11px]">
                    <User className="w-4 h-4 text-[#2D5A3F]" />
                    <span>Login</span>
                  </a>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center justify-center space-x-6 mt-3 pt-2.5 border-t border-gray-100 text-[11px] font-bold uppercase tracking-wider text-slate-650">
              <a
                href="#products"
                onClick={() => setProductFilter('all')}
                className={`hover:text-[#2D5A3F] transition-colors ${productFilter === 'all' ? 'text-[#2D5A3F]' : ''}`}
              >
                All Products &gt;
              </a>
              <a href="#products" className="hover:text-[#2D5A3F] transition-colors">Offers &gt;</a>
              <a href="#profile" className="hover:text-[#2D5A3F] transition-colors">Membership</a>
              <a href="#blog" className="hover:text-[#2D5A3F] transition-colors">Blogs</a>
              <a href="#products" className="hover:text-[#2D5A3F] transition-colors">Recipes</a>
              <a href="#home" className="hover:text-[#2D5A3F] transition-colors">About Us</a>
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-40 bg-[#1c2720]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 flex items-center justify-between text-white shadow-xl">
            <a href="#home" className="flex items-center shrink-0 group">
              <img src="/logo2.jpeg" alt="Agriic Logo" className="h-10 w-auto object-contain rounded-md group-hover:opacity-90 transition-opacity" />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1.5 border border-white/5 shadow-inner">
              {navLinks.map((link) => {
                const isActive = routePath === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`flex items-center text-[13px] font-semibold tracking-wide px-4 py-1.5 rounded-full transition-all duration-300 ${isActive
                      ? 'bg-white text-[#1c2720] shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {link.icon && link.icon}
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Right header icons */}
            <div className="flex items-center space-x-2 md:space-x-4">

              {/* Minimal Expanding Search */}
              <div className="hidden md:flex relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-white/40 group-focus-within:text-agri-lime transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 text-white text-xs rounded-full pl-9 pr-4 py-2 focus:outline-none focus:bg-white/10 focus:border-agri-lime/50 transition-all placeholder:text-white/30 w-32 focus:w-56"
                />
              </div>

              {/* Mobile Search Icon */}
              <button className="md:hidden p-2 text-white/70 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>

              <a
                href="#cart"
                onClick={(e) => { e.preventDefault(); setIsCartDrawerOpen(true); }}
                className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-agri-lime text-[#1c2720] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#1c2720] shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </a>

              {currentUser ? (
                <div className="flex items-center space-x-2 border-l border-white/10 pl-2 md:pl-4">
                  <a
                    href="#profile"
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all ${routePath === '#profile'
                      ? 'bg-[#D4A373]/20 border-[#D4A373]/50 text-[#D4A373]'
                      : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/90'
                      }`}
                  >
                    <User className="w-4 h-4 text-[#D4A373]" />
                    <span className="text-xs font-semibold hidden sm:inline">{currentUser.name || 'Alok'}</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-white/40 hover:text-red-400 font-bold px-2 py-1.5 rounded-md hover:bg-white/5 transition-all hidden sm:block"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <div className="border-l border-white/10 pl-2 md:pl-4 flex">
                  <a href="#auth" className="flex items-center space-x-1.5 hover:bg-white hover:text-[#1c2720] text-white text-xs font-bold transition-all px-4 py-2 rounded-full bg-white/10 border border-white/5 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </a>
                </div>
              )}

              {/* Mobile drawer toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-agri-lime transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </header>
        ))}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-50 bg-[#2b3a30] text-white p-6 flex flex-col space-y-5 animate-fade-in lg:hidden">
          {navLinks.map((link) => {
            const isActive = routePath === link.href;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-semibold border-b border-white/10 pb-2 flex justify-between items-center ${isActive ? 'text-agri-lime' : 'text-white'}`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </a>
            );
          })}
          <div className="pt-6 space-y-3">
            {currentUser && (
              <a
                href="#profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center block bg-white/10 hover:bg-white/15 text-white font-extrabold tracking-wider py-4 rounded-xl border border-white/15"
              >
                VIEW MY PROFILE & ORDERS
              </a>
            )}
            <a
              href="#soil-test"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center block bg-agri-lime text-[#2D5A3F] font-extrabold tracking-wider py-4 rounded-xl shadow-lg"
            >
              TAKE THE SOIL TEST™
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="page-content" className="flex-grow animate-fade-in">

        {/* VIEW 1: HOME */}
        {routePath === '#home' && (
          <div>
            {/* Section 1: Hero */}
            <section className="relative px-4 md:px-8 lg:px-12 pt-3 md:pt-8 pb-8 md:pb-16 bg-[#f7f6ee] z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[55%] md:h-[65%] bg-[#2b3a30] z-0 rounded-b-[32px] md:rounded-b-[40px]"></div>

              <div className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden relative flex flex-col min-h-[420px] md:min-h-[600px] shadow-2xl bg-[#1b251f] z-10 mx-auto max-w-[1440px]">
                {/* Carousel Track */}
                <div
                  className="flex w-[300%] h-full transition-transform duration-700 ease-in-out flex-grow"
                  style={{ transform: `translateX(-${(heroSlide * 100) / 3}%)` }}
                >
                  {/* Slide 1: Membership */}
                  <div className="w-1/3 h-full relative">
                    <img
                      src="/agriic_membership.png"
                      alt="Farmer using digital app"
                      className="absolute inset-0 w-full h-full object-cover object-center z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2b3a30]/90 via-[#2b3a30]/55 to-transparent z-10" />
                    <div className="relative z-20 w-full px-6 md:px-12 flex items-center min-h-[420px] md:min-h-[600px] h-full">
                      <div className="max-w-xl text-left py-12">
                        <span
                          className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4 rounded-full"
                          style={{ backgroundColor: '#6DBE8C' }}
                        >
                          AGRIIC PREMIUM MEMBERSHIP
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line">
                          Join the club for ultimate farm care.
                        </h2>
                        <ul className="text-white/90 text-sm md:text-base max-w-md mb-8 space-y-2 text-left">
                          <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-agri-lime" /> Priority Diagnostic Soil Testing</li>
                          <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-agri-lime" /> Monthly 1-on-1 Agronomist Calls</li>
                          <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-agri-lime" /> Exclusive Discounts on Nutrient Kits</li>
                          <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-agri-lime" /> Free Expedited Shipping</li>
                          <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-agri-lime" /> Dedicated 24/7 Crop Coach</li>
                        </ul>
                        <a
                          href="#profile"
                          className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 rounded-full"
                          style={{ backgroundColor: '#6DBE8C' }}
                        >
                          JOIN THE CLUB
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: Products */}
                  <div className="w-1/3 h-full relative">
                    <img
                      src="/agriic_products.png"
                      alt="Premium organic fertilizer products"
                      className="absolute inset-0 w-full h-full object-cover object-center z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1c3a2a]/90 via-[#1c3a2a]/55 to-transparent z-10" />
                    <div className="relative z-20 w-full px-6 md:px-12 flex items-center min-h-[420px] md:min-h-[600px] h-full">
                      <div className="max-w-xl text-left py-12">
                        <span
                          className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4 rounded-full"
                          style={{ backgroundColor: '#D4A373' }}
                        >
                          OUR FORMULAS
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line">
                          Science-Led Organic Nutrition.
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                          Browse our premium range of highly concentrated organic formulas designed to unlock your farm's maximum genetic yield: Bloom Boosters, Root Expanders, and Defense Enhancers.
                        </p>
                        <a
                          href="#products"
                          className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 rounded-full"
                          style={{ backgroundColor: '#D4A373' }}
                        >
                          BUY NOW
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3: Why Agric (Before & After) */}
                  <div className="w-1/3 h-full relative">
                    <img
                      src="/agriic_before_after.png"
                      alt="Before and after organic fertilizer effect"
                      className="absolute inset-0 w-full h-full object-cover object-center z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#314227]/90 via-[#314227]/55 to-transparent z-10" />
                    <div className="relative z-20 w-full px-6 md:px-12 flex items-center min-h-[420px] md:min-h-[600px] h-full">
                      <div className="max-w-xl text-left py-12">
                        <span
                          className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4 rounded-full"
                          style={{ backgroundColor: '#6DBE8C' }}
                        >
                          PROVEN IMPACT
                        </span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line">
                          Why Agriic Nutrition Works.
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                          Witness the dramatic transformation. We focus on the root ecosystem, not just the foliage, creating lasting health, defense mechanisms, and incredible vigor.
                        </p>
                        <a
                          href="#science"
                          className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 rounded-full"
                          style={{ backgroundColor: '#6DBE8C' }}
                        >
                          SEE THE SCIENCE
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-30 flex justify-center items-center space-x-3">
                  {[0, 1, 2].map(index => (
                    <button
                      key={index}
                      onClick={() => setHeroSlide(index)}
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${heroSlide === index ? 'bg-agri-lime scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows for desktop */}
                <div className="absolute inset-y-0 left-4 right-4 md:left-8 md:right-8 z-30 hidden md:flex justify-between items-center pointer-events-none">
                  <button
                    onClick={() => setHeroSlide(prev => (prev - 1 + 3) % 3)}
                    className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex justify-center items-center backdrop-blur-sm pointer-events-auto transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setHeroSlide(prev => (prev + 1) % 3)}
                    className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex justify-center items-center backdrop-blur-sm pointer-events-auto transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Stats Bar: Compact, clean row on mobile that fits perfectly inside screen width */}
              <div className="relative z-20 max-w-[1440px] mx-auto mt-6 md:mt-12 w-full">
                <div className="flex flex-row justify-between gap-2.5 w-full">
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-agri-red-accent flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {farmersCount || 0}L+
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Indian Farmers</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-agri-gold flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {resultsPct || 0}%
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Saw Yield Boost</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-lg border-b-4 md:border-b-[6px] border-[#369654] flex-1">
                    <span className="block text-lg sm:text-3xl font-black text-gray-900 leading-none mb-1">
                      {ratingVal ? ratingVal.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-gray-500 font-extrabold uppercase tracking-wider block">Google Rating</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2 text-[9px] md:text-xs text-gray-400 italic">
                  *Based on long-term trial observations across Indian soil profiles, March 2026.
                </div>
              </div>
            </section>

            {/* Section 2: Products Showcase */}
            <section className="py-12 md:py-24 px-4 md:px-12 bg-white rounded-b-[32px] md:rounded-b-[40px] relative z-20 shadow-sm border-b border-gray-100">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-agri-green-mid uppercase tracking-[0.2em] mb-2"><ShoppingCart className="w-3.5 h-3.5" />OUR STORE</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
                      Grow More. <span className="text-agri-green-mid">Spend Less.</span>
                    </h2>
                  </div>

                  <div className="flex space-x-2 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
                    <button
                      onClick={() => setProductTab('fertilizer')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 ${productTab === 'fertilizer'
                        ? 'bg-[#2b3a30] text-[#D4A373] shadow-md scale-100'
                        : 'bg-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      FERTILIZERS
                    </button>
                    <button
                      onClick={() => setProductTab('seeds')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 ${productTab === 'seeds'
                        ? 'bg-[#2b3a30] text-[#D4A373] shadow-md scale-100'
                        : 'bg-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      SEEDS
                    </button>
                    <button
                      onClick={() => setProductTab('gardening')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 ${productTab === 'gardening'
                        ? 'bg-[#2b3a30] text-[#D4A373] shadow-md scale-100'
                        : 'bg-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      GARDENING
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-4 animate-fade-in">
                  {liveProducts
                    .filter(p => {
                      if (productTab === 'fertilizer') return (p.category.toLowerCase().includes('nutrition') || p.category.toLowerCase().includes('soil'));
                      if (productTab === 'seeds') return p.category.toLowerCase().includes('seed');
                      return (p.category.toLowerCase().includes('tool') || p.category.toLowerCase().includes('pest'));
                    })
                    .slice(0, 4) // Show up to 4 per category
                    .map((p) => (
                      <div key={p.id} className="bg-white rounded-[16px] md:rounded-[24px] overflow-hidden border border-[#e6e6e6] hover:border-[#D4A373] group transition-all duration-300 hover:shadow-xl md:hover:-translate-y-1 flex flex-col h-full">
                        <div className="relative bg-[#f7f6ee] flex justify-center items-center h-28 sm:h-36 md:h-64 overflow-hidden">
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          {p.stock <= p.lowStockLimit && (
                            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white z-10 shadow-sm">
                              Low Stock
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 sm:p-3.5 md:p-6 flex flex-col flex-grow bg-white">
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#2D5A3F] uppercase tracking-[0.15em] mb-1 sm:mb-1.5 md:mb-2 block truncate">
                            {p.category.replace('-', ' ')}
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-xl font-extrabold text-gray-900 mb-1 sm:mb-2 md:mb-3 leading-tight group-hover:text-[#2D5A3F] transition-colors line-clamp-1 sm:line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="hidden sm:block text-xs md:text-sm text-gray-500 mb-2 sm:mb-4 flex-grow leading-relaxed line-clamp-3">
                            {p.desc}
                          </p>
                          <div className="mt-auto mb-2 sm:mb-3 md:mb-4 pt-2 sm:pt-3 md:pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-gray-400 line-through">₹{Math.round(p.price / 0.9)}</span>
                              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                                <span className="text-sm sm:text-base md:text-xl font-black text-gray-900 leading-none">₹{p.price}</span>
                                <span className="bg-[#fee2e2] text-[#dc2626] px-1 py-0.5 sm:px-1.5 md:px-2 md:py-0.5 rounded text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none">10% OFF</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(p);
                            }}
                            className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 border border-gray-200 sm:border-2 sm:border-gray-100 hover:border-[#2D5A3F] hover:bg-[#f9faf5] text-gray-800 font-extrabold py-1.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs uppercase tracking-widest transition-all duration-300"
                          >
                            <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Empty state fallback in case there are no products */}
                  {liveProducts.filter(p => {
                    if (productTab === 'fertilizer') return (p.category.toLowerCase().includes('nutrition') || p.category.toLowerCase().includes('soil'));
                    if (productTab === 'seeds') return p.category.toLowerCase().includes('seed');
                    return (p.category.toLowerCase().includes('tool') || p.category.toLowerCase().includes('pest'));
                  }).length === 0 && (
                      <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-bold text-gray-400 mb-1">No products found in this category</h3>
                      </div>
                    )}
                </div>
              </div>
            </section>

            {/* Partition Button: View Our Shop */}
            <div className="relative w-full flex justify-center z-30" style={{ marginTop: '-28px', marginBottom: '-28px' }}>
              <a
                href="#products"
                className="group flex items-center gap-3 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-8 py-3.5 md:px-10 md:py-4 rounded-full text-[#2D5A3F] font-extrabold uppercase tracking-[0.15em] text-xs md:text-sm transition-all duration-300 hover:scale-105 hover:bg-[#2D5A3F] hover:text-white"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#f4f7f5] flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                View Our Shop
              </a>
            </div>

            {/* Section 2.5: Soil Health Pillars */}
            <section className="py-12 md:py-20 px-4 md:px-12 bg-white border-b border-gray-100">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-center md:justify-start gap-3 md:gap-4 mb-8 md:mb-10">
                  <button className="flex items-center gap-1.5 md:gap-2 bg-[#2D5A3F] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-extrabold shadow-md">
                    <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4" /> Organic Benefits
                  </button>
                  <button className="flex items-center gap-1.5 md:gap-2 bg-[#f7f6ee] border border-gray-200 text-gray-600 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-extrabold hover:bg-gray-100 transition-colors">
                    <FlaskConical className="w-3.5 h-3.5 md:w-4 md:h-4" /> Chemical Farming
                  </button>
                </div>

                <div className="max-w-3xl mb-8 md:mb-12">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D5A3F] tracking-tight mb-3 md:mb-4">Why Choose Organic Farming?</h2>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    See how organic farming nourishes your soil, strengthens your crops, and builds a sustainable future.
                  </p>
                </div>

                {/* 4 icons row */}
                <div className="flex flex-row overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-14 pb-3 no-scrollbar snap-x">
                  {[
                    { icon: <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#2D5A3F]" />, title: 'Chemical-Free', desc: 'Safe for soil, crops and your family' },
                    { icon: <Sprout className="w-5 h-5 md:w-6 md:h-6 text-[#2D5A3F]" />, title: 'Better Soil Health', desc: 'Improves fertility and soil structure' },
                    { icon: <Recycle className="w-5 h-5 md:w-6 md:h-6 text-[#2D5A3F]" />, title: 'Sustainable Farming', desc: 'Protects environment for future generations' },
                    { icon: <Droplet className="w-5 h-5 md:w-6 md:h-6 text-[#2D5A3F]" />, title: 'Water Efficient', desc: 'Improves water retention in soil' }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 md:gap-4 min-w-[190px] md:min-w-0 snap-start">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f7f6ee] border border-gray-200 flex items-center justify-center shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-[11px] md:text-sm font-extrabold text-[#2D5A3F] mb-0.5 md:mb-1">{feature.title}</h4>
                        <p className="text-[9px] md:text-xs text-gray-500 leading-snug pr-2">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3 month-stage cards — horizontal snap scroll on mobile, row on desktop */}
                <div className="flex flex-row overflow-x-auto md:overflow-visible gap-4 items-stretch mb-8 md:mb-10 snap-x snap-mandatory no-scrollbar pb-4 md:pb-0">
                  {[
                    {
                      month: 'Month 1',
                      color: '#2D5A3F',
                      title: 'Soil Activation',
                      points: ['Beneficial microbes increase', 'Better nutrient availability', 'Improved soil structure'],
                      img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80'
                    },
                    {
                      month: 'Month 2',
                      color: '#3d7a5a',
                      title: 'Root Development',
                      points: ['Deeper root growth', 'Higher water retention', 'Stronger nutrient uptake'],
                      img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80'
                    },
                    {
                      month: 'Month 3',
                      color: '#2b6b3d',
                      title: 'Healthy Crop Growth',
                      points: ['Strong stems and leaves', 'Better resistance to stress', 'Improved crop quality'],
                      img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'
                    }
                  ].map((card, i) => (
                    <React.Fragment key={i}>
                      <div className="min-w-[82%] sm:min-w-[55%] md:min-w-0 snap-center md:snap-align-none bg-[#fcfbf7] border border-gray-200 shadow-sm rounded-[24px] p-5 md:p-6 flex-1 flex flex-col relative overflow-hidden group hover:border-[#D4A373] hover:shadow-lg transition-all duration-300">
                        <div className="inline-block text-white text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-md w-max mb-3 md:mb-4 uppercase tracking-wider" style={{ backgroundColor: card.color }}>
                          {card.month}
                        </div>
                        <h3 className="text-base md:text-lg font-extrabold text-[#2D5A3F] mb-3 md:mb-4 group-hover:text-[#2D5A3F] transition-colors">{card.title}</h3>
                        <ul className="space-y-2 md:space-y-2.5 mb-5 md:mb-6 z-10 relative flex-grow">
                          {card.points.map((pt, j) => (
                            <li key={j} className="flex items-start gap-2 text-[10px] md:text-xs text-gray-600 font-semibold leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3F] mt-1.5 shrink-0"></span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                        <div className="relative mt-auto h-36 md:h-44 w-full overflow-hidden rounded-xl">
                          <img
                            src={card.img}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfbf7]/50 to-transparent pointer-events-none" />
                        </div>
                      </div>
                      {i < 2 && (
                        <div className="hidden md:flex items-center justify-center shrink-0 w-8">
                          <div className="w-6 h-6 rounded-full bg-[#2D5A3F] text-[#D4A373] flex items-center justify-center shadow-md border-2 border-white z-10">
                            <ChevronRight className="w-3 h-3" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Green organic banner */}
                <div className="bg-[#fcfbf7] border border-gray-200 shadow-sm rounded-[24px] p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 group hover:border-[#D4A373] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md">
                      <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80"
                        alt="Farm Landscape"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1 md:flex-none">
                      <h3 className="text-base md:text-lg font-extrabold text-[#2D5A3F] mb-0.5 md:mb-1">Grow Naturally with Agriic</h3>
                      <p className="text-[9px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider">Healthy Soil • Healthy Crops • Healthy Future</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex items-center gap-2 bg-[#eaf1d4] px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black text-[#365922]">
                      <Leaf className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Organic today,<br className="hidden md:block" />a better tomorrow.</span>
                    </div>
                    <a href="#products" className="bg-[#2D5A3F] hover:bg-[#2D5A3F] text-white text-[10px] md:text-xs font-extrabold px-5 md:px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 md:gap-2 shadow-md w-full sm:w-auto tracking-widest uppercase active:scale-95">
                      Explore Organic Solutions <ArrowRight className="w-3 h-3 md:w-4 md:h-4" strokeWidth={3} />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Who We Are */}
            <section className="bg-[#1b251f] text-white py-16 md:py-24 px-4 md:px-12 relative overflow-hidden" id="about">
              <div className="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 bg-[#D4A373]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

              <div className="max-w-7xl mx-auto relative z-10">

                <div className="flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-12">
                  <div className="w-full lg:w-1/2">
                    <span className="text-[10px] md:text-xs font-black text-[#D4A373] uppercase tracking-widest block mb-2 md:mb-4">WHO WE ARE</span>
                    <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight tracking-tight">
                      Built by farmers. <br className="hidden md:block" /><span className="text-[#D4A373]">Backed by science.</span>
                    </h2>
                    <p className="text-white/75 text-xs md:text-base leading-relaxed mb-4 md:mb-5">
                      Agriic was born from a simple frustration — watching generations of Indian farmers apply generic chemicals to unique soils, and wondering why yields kept falling. Founded in 2021 in Pune, Maharashtra, we set out to change that with one core belief: <strong className="text-white">every farm deserves a personalized solution.</strong>
                    </p>
                    <p className="text-white/75 text-xs md:text-base leading-relaxed mb-6 md:mb-8">
                      Today, we serve <strong className="text-white">5 lakh+ farmers</strong> across 18 Indian states, combining AI-powered soil diagnostics, certified organic inputs, and live agronomist support — all in one platform designed for the fields of Bharat.
                    </p>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      {[
                        { num: '5L+', label: 'Farmers Served' },
                        { num: '18', label: 'States Covered' },
                        { num: '2021', label: 'Founded In' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-2.5 md:p-4 text-center backdrop-blur-sm">
                          <div className="text-xl md:text-3xl font-black text-[#D4A373] mb-0.5 md:mb-1">{stat.num}</div>
                          <div className="text-[9px] md:text-[11px] text-white/60 font-semibold uppercase tracking-wide leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2">
                    <div className="relative rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl rounded-bl-xl md:rounded-tl-[80px] md:rounded-br-[80px] md:rounded-tr-2xl md:rounded-bl-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80"
                        alt="Agriic team working in the field"
                        className="w-full h-48 sm:h-64 md:h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a1e]/80 md:from-[#1a2a1e]/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 inline-flex items-center space-x-2 md:space-x-3">
                          <Award className="w-4 h-4 md:w-5 md:h-5 text-[#D4A373] shrink-0" />
                          <span className="text-[10px] md:text-sm font-bold text-white">ICAR Recognized Agri-Tech Company, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>


            {/* Section 4: Best Sellers */}
            <section className="py-16 md:py-24 px-4 md:px-12 bg-agri-cream border-t border-b border-agri-cream-border">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-3">FARMER FAVORITES</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Best Sellers</h2>
                </div>

                <div ref={bestSellersRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 pb-4">
                  {liveProducts.slice(0, 4).map((p) => (
                    <div key={p.id} className="bg-white rounded-[16px] md:rounded-[24px] overflow-hidden border border-[#e6e6e6] hover:border-[#D4A373] group transition-all duration-300 hover:shadow-xl md:hover:-translate-y-1 flex flex-col h-full">
                      <div className="relative bg-[#f7f6ee] flex justify-center items-center h-28 sm:h-36 md:h-64 overflow-hidden">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        {p.stock <= p.lowStockLimit && (
                          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white z-10 shadow-sm">
                            Low Stock
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-3.5 md:p-6 flex flex-col flex-grow bg-white">
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#2D5A3F] uppercase tracking-[0.15em] mb-1 sm:mb-1.5 md:mb-2 block truncate">
                          {p.category.replace('-', ' ')}
                        </span>
                        <h3 className="text-xs sm:text-sm md:text-xl font-extrabold text-gray-900 mb-1 sm:mb-2 md:mb-3 leading-tight group-hover:text-[#2D5A3F] transition-colors line-clamp-1 sm:line-clamp-2">
                          {p.name}
                        </h3>
                        <p className="hidden sm:block text-[9px] md:text-sm text-gray-500 mb-2 sm:mb-4 flex-grow leading-relaxed line-clamp-2 md:line-clamp-3">
                          {p.desc}
                        </p>
                        <div className="mt-auto mb-2 sm:mb-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-gray-400 line-through">₹{Math.round(p.price / 0.9)}</span>
                            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                              <span className="text-sm sm:text-base md:text-xl font-black text-gray-900 leading-none">₹{p.price}</span>
                              <span className="bg-[#fee2e2] text-[#dc2626] px-1 py-0.5 sm:px-1.5 md:px-2 md:py-0.5 rounded text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-none">10% OFF</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(p);
                          }}
                          className="w-full flex items-center justify-center space-x-1.5 sm:space-x-2 border border-gray-200 sm:border-2 sm:border-gray-100 hover:border-[#2D5A3F] hover:bg-[#f9faf5] text-gray-800 font-extrabold py-1.5 sm:py-2 md:py-3.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs uppercase tracking-widest transition-all duration-300"
                        >
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2.5} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>


            {/* Section 6: Big Brand Science banner */}
            <section className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1440px] mx-auto bg-agri-dark text-white py-12 md:py-20 px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl rounded-bl-xl md:rounded-tl-[120px] md:rounded-br-[120px] md:rounded-tr-2xl md:rounded-bl-2xl my-8 md:my-16 shadow-2xl relative overflow-hidden">
              {/* Decorative background blobs to enhance the premium feel */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A373]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4A373]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

              <div className="w-full lg:w-1/2 mb-8 lg:mb-0 max-w-xl z-10">
                <span className="text-xs font-bold text-agri-lime tracking-widest uppercase block mb-2 font-mono">SOIL DISCIPLINE</span>
                <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 leading-tight">Root development science is our priority.</h2>
                <p className="text-white/80 leading-relaxed text-xs md:text-base">
                  Most fertilizers only feed the leaf, forcing immediate growth on fragile stalks. Agriic works from the bottom up. We enrich root structures first, securing long-term nutrient storage. Healthy plants are merely the natural side-effect of rich soil.
                </p>
                <div className="mt-6 md:mt-8">
                  <a href="#soil-test" className="btn-primary inline-block text-xs md:text-sm">Diagnostic Soil Test</a>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center z-10">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=700&q=80"
                  alt="Root system structure photography"
                  className="rounded-tl-[48px] rounded-br-[48px] rounded-tr-xl rounded-bl-xl md:rounded-tl-[80px] md:rounded-br-[80px] md:rounded-tr-2xl md:rounded-bl-2xl w-full max-w-md object-cover h-52 md:h-72 shadow-2xl border-2 border-white/10"
                />
              </div>
            </section>

            {/* Section 7: From Farmer to Future */}
            <section className="py-16 md:py-24 bg-white relative" id="farmer-to-future">
              <div className="max-w-[1440px] mx-auto px-4 md:px-8">

                {/* Part 1: Hero */}
                <div className="flex flex-col lg:flex-row items-center gap-12 mb-20 max-w-7xl mx-auto">
                  <div className="w-full lg:w-[45%] pl-4 md:pl-8">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-[#1a2a1e] leading-tight mb-6 tracking-tight">
                      From Farmer to Future.<br />
                      <span className="text-[#365922]">The Agriic Way.</span>
                    </h2>
                    <p className="text-gray-700 text-sm md:text-lg leading-relaxed mb-10 max-w-lg font-medium">
                      We move farmers to organic the right way — with complete support, end-to-end care, and a promise to buy, process, and sell their harvest.
                    </p>
                    <button className="bg-[#2D5A3F] hover:bg-[#2D5A3F] text-white font-extrabold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1">
                      Our Journey Together
                    </button>
                  </div>
                  <div className="w-full lg:w-[55%] relative flex items-center justify-center">
                    <div className="rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl relative w-full h-auto">
                      <img src="/farmerimg1.jpeg" alt="Happy Indian Farmer" className="w-full h-auto object-cover block" />
                      {/* Gradient overlay for text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                {/* Part 2: End-to-End Support Process */}
                <div className="mb-24 max-w-7xl mx-auto">
                  <h3 className="text-center text-2xl md:text-3xl font-extrabold text-[#1a2a1e] mb-16 tracking-tight">Our End-to-End Support for Farmers</h3>

                  <div className="relative">
                    {/* Dashed connector line for desktop */}
                    <div className="hidden md:block absolute top-[44px] left-[7%] right-[7%] h-0.5 border-t-2 border-dashed border-[#8dbb43] z-0"></div>

                    {/* Mobile: horizontal snap scroll showing exactly 2 steps at a time. Desktop: 7-col grid */}
                    <div className="flex flex-row overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-4 md:pb-0 md:grid md:grid-cols-7 md:gap-4 md:overflow-visible relative z-10">
                      {[
                        { num: 1, icon: <ShoppingBag />, title: 'We Provide\nQuality Inputs', desc: 'We provide certified organic seeds and natural fertilizers to start your organic journey.' },
                        { num: 2, icon: <HandHeart />, title: 'Guidance for\nOrganic Transition', desc: 'We train and guide farmers to adopt organic practices and improve soil health.' },
                        { num: 3, icon: <Sprout />, title: 'Agriic Observes\n& Supports', desc: 'Our team monitors crops throughout the growing period with regular field visits and support.' },
                        { num: 4, icon: <TrendingUp />, title: 'Better Yield,\nBetter Income', desc: 'Healthier crops, higher yield and better quality ensure better returns for farmers.' },
                        { num: 5, icon: <Truck />, title: 'You Sell,\nWe Buy', desc: 'After harvest, you sell your crop to us at a fair and assured price.' },
                        { num: 6, icon: <Factory />, title: 'We Process\nwith Care', desc: 'We clean, grade and process your produce while maintaining its quality.' },
                        { num: 7, icon: <ShoppingCart />, title: 'We Sell on Our\nOnline Platform', desc: 'Your crops reach thousands of customers through our online store - fresh and trusted.' }
                      ].map((step, i) => (
                        <div key={i} className="snap-start flex-none flex flex-col items-center text-center relative group bg-gradient-to-b from-white to-[#f9faf5] md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-gray-150 md:border-0 shadow-sm hover:shadow-md hover:border-[#D4A373] md:shadow-none transition-all duration-300" style={{ width: 'calc(50% - 6px)' }}>
                          {/* Number badge */}
                          <div className="absolute top-2 left-2 md:-top-2 md:-left-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#365922] text-white flex items-center justify-center text-[9px] md:text-[10px] font-black z-20 shadow-md transition-transform group-hover:scale-110">
                            {step.num}
                          </div>

                          {/* Icon container */}
                          <div className="w-14 h-14 md:w-24 md:h-24 bg-white md:bg-[#fcfbf7] rounded-[16px] md:rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-center text-[#365922] mb-3 md:mb-6 mt-2 md:mt-0 relative z-10 transition-all duration-300 group-hover:shadow-md group-hover:border-[#D4A373] group-hover:-translate-y-1">
                            <div className="[&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-10 md:[&>svg]:h-10 [&>svg]:stroke-[1.5]">{step.icon}</div>
                          </div>

                          <h4 className="font-extrabold text-[#1a2a1e] text-[11px] md:text-sm mb-1 md:mb-3 whitespace-pre-line leading-tight md:h-10">{step.title}</h4>
                          <p className="text-[10px] md:text-[11px] text-gray-500 font-medium px-1 leading-relaxed line-clamp-3 md:line-clamp-6">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Part 3: Why Choose Agriic (Benefits) */}
                <div className="bg-[#fcfbf7] rounded-[40px] p-8 md:p-12 mb-10 shadow-sm border border-gray-100 max-w-7xl mx-auto transition-shadow hover:shadow-md">
                  <h3 className="text-center text-2xl font-extrabold text-[#1a2a1e] mb-12 tracking-tight">Why Farmers Choose Agriic</h3>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 lg:gap-6">
                    {[
                      { icon: <HandHeart />, title: 'Complete Support', desc: 'From input to income, we are with you.' },
                      { icon: <Shield />, title: 'Assured Purchase', desc: 'We buy your crop at fair and transparent prices.' },
                      { icon: <Sprout />, title: 'Soil & Yield Growth', desc: 'Organic practices improve soil health and boost yield.' },
                      { icon: <Coins />, title: 'Better Earnings', desc: 'Higher quality crops lead to better returns.' },
                      { icon: <Users />, title: 'Long-Term Partnership', desc: 'We grow together for a sustainable future.' }
                    ].map((benefit, i) => (
                      <div key={i} className="flex flex-row md:flex-col lg:flex-row items-center md:items-start text-left gap-4 md:gap-3 lg:gap-4 group">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#eaf1d4] flex items-center justify-center text-[#365922] shrink-0 transition-transform duration-300 group-hover:scale-110">
                          <div className="[&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7 [&>svg]:stroke-[1.5]">{benefit.icon}</div>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#1a2a1e] text-[13px] md:text-sm mb-1 leading-tight">{benefit.title}</h4>
                          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part 4: Footer Banner */}
                <div className="bg-[#243f29] rounded-[24px] p-6 md:p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6 lg:gap-8 shadow-2xl relative overflow-hidden max-w-7xl mx-auto">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 z-10 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-8 h-8 text-white fill-white" />
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white">Agriic</h3>
                    </div>
                    <div className="h-10 w-px bg-white/20 hidden md:block mt-1"></div>
                    <p className="text-white/80 text-[10px] md:text-xs font-semibold leading-relaxed text-center md:text-left">
                      Empowering farmers. Enriching lives.<br />
                      Building a sustainable tomorrow.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-6 md:gap-4 lg:gap-8 z-10 flex-wrap md:flex-nowrap">
                    {[
                      { icon: <Leaf />, label: 'Organic Inputs' },
                      { icon: <User />, label: 'Expert Guidance' },
                      { icon: <Shield />, label: 'Fair Price Assurance' },
                      { icon: <ShoppingCart />, label: 'Market Access' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="text-white/80 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[1.5] transition-transform hover:scale-110">{item.icon}</div>
                        <span className="text-[8px] lg:text-[9px] text-white/70 font-bold uppercase tracking-wider text-center hidden md:block whitespace-nowrap">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-2 z-10 w-full md:w-auto mt-4 md:mt-0">
                    <button className="bg-[#D4A373] hover:bg-white text-[#1a2a1e] font-extrabold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg w-full md:w-auto group">
                      Join Agriic Today <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                    </button>
                    <p className="text-[9px] text-white/60 font-semibold tracking-wide">
                      Together, let's grow better.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 8: MEMBERSHIP HUB */}
            <div id="membership" className="w-full bg-white relative overflow-hidden">

              {/* 1. Hero Section */}
              <section className="relative bg-gradient-to-br from-[#1a2a1e] to-[#2c3e2d] py-24 px-6 md:px-12 text-center text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1628183185360-1e5b15b6d9be?auto=format&fit=crop&w=1920&q=80" alt="Farm Background" className="w-full h-full object-cover mix-blend-overlay" />
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                  <span className="text-xs md:text-sm font-black text-[#D4A373] tracking-widest block mb-4 uppercase">AGRIIC PREMIUM MEMBERSHIP</span>
                  <h2 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                    Own The Harvest,<br />Not The Hassle.
                  </h2>
                  <p className="text-white/80 text-sm md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
                    Become a member of India's most transparent organic farming ecosystem. Track your crops, visit your farm, and receive fresh harvests directly from your dedicated farmland.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-[#D4A373] text-[#1a2a1e] rounded-full font-extrabold text-sm hover:bg-white transition shadow-xl">
                      Join Membership
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-full font-extrabold text-sm border border-white/20 hover:bg-white/20 transition backdrop-blur-md">
                      Book Farm Visit
                    </button>
                  </div>
                </div>
              </section>

              {/* 2. How Membership Works */}
              <section className="py-20 px-0 md:px-12 bg-[#f7f6ee]">
                <div className="max-w-7xl mx-auto text-center">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-16 tracking-tight px-6 md:px-0">How Membership Works</h3>

                  <div className="overflow-x-auto no-scrollbar pb-8 px-6 md:px-0 snap-x snap-mandatory">
                    <div className="flex flex-row md:grid md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-8 relative min-w-max md:min-w-0">
                      {/* Decorative connecting line */}
                      <div className="absolute top-8 left-16 right-16 h-0.5 bg-gray-200 z-0"></div>

                      {[
                        { step: '01', title: 'Choose Plan' },
                        { step: '02', title: 'Farm Allocation' },
                        { step: '03', title: 'Crop Planning' },
                        { step: '04', title: 'Organic Cultivation' },
                        { step: '05', title: 'Live Tracking' },
                        { step: '06', title: 'Harvest Delivery' },
                      ].map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center min-w-[140px] md:min-w-0 flex-shrink-0 snap-center">
                          <div className="w-16 h-16 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-xl font-black text-[#D4A373] mb-4">
                            {item.step}
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">{item.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Pricing Cards */}
              <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Select Your Farm Size</h3>
                  </div>
                  <div
                    ref={pricingRef}
                    className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 md:grid md:grid-cols-3 md:gap-8 pb-8 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth"
                    onScroll={(e) => {
                      if (window.innerWidth >= 768) return;
                      const el = e.currentTarget;
                      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
                      let closestIndex = 1;
                      let minDiff = Infinity;
                      Array.from(el.children).forEach((child, i) => {
                        const card = child as HTMLElement;
                        const cardCenter = card.offsetLeft + card.clientWidth / 2 - el.offsetLeft;
                        const diff = Math.abs(scrollCenter - cardCenter);
                        if (diff < minDiff) {
                          minDiff = diff;
                          closestIndex = i;
                        }
                      });
                      setActivePlanIndex(closestIndex);
                    }}
                  >
                    {[
                      { name: 'Family', price: '₹25,000/yr', area: '500 sq.m', veg: true, fruit: false, grain: false, visit: false, custom: false, priority: false, manager: false },
                      { name: 'Premium', price: '₹50,000/yr', area: '1000 sq.m', veg: true, fruit: true, grain: true, visit: true, custom: false, priority: false, manager: false },
                      { name: 'Elite', price: '₹1,00,000/yr', area: '2000 sq.m', veg: true, fruit: true, grain: true, visit: true, custom: true, priority: true, manager: true },
                    ].map((plan, i) => {
                      const isPopular = activePlanIndex === i;
                      const planColor = isPopular ? 'bg-[#2c3e2d]' : 'bg-white';
                      const planText = isPopular ? 'text-white' : 'text-gray-900';

                      return (
                        <div
                          key={i}
                          className={`relative rounded-3xl p-8 border transition-all duration-500 ease-out ${isPopular ? 'border-[#D4A373] shadow-2xl md:scale-105 z-10' : 'border-gray-200 shadow-lg'} ${planColor} flex flex-col w-[85vw] max-w-[85vw] flex-shrink-0 snap-center cursor-pointer md:w-auto md:max-w-none md:min-w-0`}
                          onMouseEnter={() => window.innerWidth >= 768 && setActivePlanIndex(i)}
                        >
                          {isPopular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A373] text-[#1a2a1e] font-black text-[10px] px-4 py-1 rounded-full tracking-widest uppercase shadow-md whitespace-nowrap transition-opacity duration-300">Selected</span>}
                          <h4 className={`text-xl font-black mb-2 transition-colors duration-300 ${planText}`}>{plan.name} Plan</h4>
                          <div className={`text-4xl font-extrabold mb-1 transition-colors duration-300 ${planText}`}>{plan.price}</div>
                          <p className={`text-sm mb-6 transition-colors duration-300 ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>Farm Allocation: {plan.area}</p>

                          <div className="space-y-4 mb-8 flex-grow">
                            {[
                              { label: 'Seasonal Vegetables', active: plan.veg },
                              { label: 'Fresh Fruits', active: plan.fruit },
                              { label: 'Grains & Pulses', active: plan.grain },
                              { label: 'Farm Visits Allowed', active: plan.visit },
                              { label: 'Customized Crops', active: plan.custom },
                              { label: 'Priority Harvest', active: plan.priority },
                              { label: 'Personal Farm Manager', active: plan.manager },
                            ].map((feat, j) => (
                              <div key={j} className="flex items-center text-sm font-semibold">
                                {feat.active ? (
                                  <div className="w-5 h-5 rounded-full bg-[#D4A373] flex justify-center items-center mr-3 shrink-0 text-[#1a2a1e] text-[10px] font-black transition-colors duration-300">✓</div>
                                ) : (
                                  <div className={`w-5 h-5 rounded-full border transition-colors duration-300 ${isPopular ? 'border-white/20' : 'border-gray-300'} flex justify-center items-center mr-3 shrink-0 ${isPopular ? 'text-white/30' : 'text-gray-400'} text-[10px] font-black`}>✕</div>
                                )}
                                <span className={`transition-colors duration-300 ${isPopular ? 'text-white/90' : 'text-gray-700'}`}>{feat.label}</span>
                              </div>
                            ))}
                          </div>
                          <button className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all duration-300 ${isPopular ? 'bg-[#D4A373] text-[#1a2a1e] hover:bg-white' : 'bg-gray-100 text-gray-900 hover:bg-[#D4A373]'}`}>
                            Become a Member
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>



              {/* 5. Dashboard Preview & Gallery */}
              <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-12 mb-16 md:mb-24">
                    <div className="w-full lg:w-1/2">
                      <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-4">DIGITAL TRANSPARENCY</span>
                      <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Farm Tracking Dashboard</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Every member gets access to our exclusive portal. Watch your food grow from seed to harvest. Track live crop status, view farm photos and videos, check your harvest calendar, and track deliveries.
                      </p>
                      <ul className="space-y-3">
                        {['Live Crop Status & Photos', 'Video Updates', 'Harvest Calendar', 'Delivery Tracking'].map((li, i) => (
                          <li key={i} className="flex items-center text-gray-800 font-bold text-sm">
                            <div className="w-5 h-5 rounded-full bg-[#D4A373] flex justify-center items-center mr-3 text-[#1a2a1e] text-[10px]">✓</div>
                            {li}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-full lg:w-1/2 relative pr-2 md:pr-0">
                      <div className="absolute inset-0 bg-[#D4A373]/20 rounded-[32px] transform translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4"></div>
                      <img src="dashboard.jpeg" alt="Dashboard App Mockup" className="relative rounded-[32px] shadow-2xl w-full border border-gray-100 object-cover" />
                    </div>
                  </div>

                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Life on the Farm</h3>
                  </div>
                  <div className="grid grid-cols-2 grid-rows-2 gap-3 md:grid-rows-1 md:grid-cols-4 md:gap-4 pb-6">
                    {[
                      'https://images.unsplash.com/photo-1592982537447-6f23342d8d80?auto=format&fit=crop&w=500&q=80',
                      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500&q=80',
                      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
                      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&q=80'
                    ].map((img, i) => (
                      <img key={i} src={img} alt="Farm Gallery" className="w-full aspect-square md:h-64 md:aspect-auto object-cover rounded-[16px] md:rounded-[24px] hover:scale-[1.02] transition duration-300 cursor-pointer shadow-sm" />
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 9: Health & Organic Benefits */}
              <section className="py-20 md:py-32 px-6 md:px-12 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-4">YOUR HEALTH FIRST</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">The true cost of what's on your plate.</h2>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                      The modern food industry has prioritized scale over safety. Discover the stark reality of chemical agriculture, and why transitioning to 100% organic is the only sustainable choice for your family's health and longevity.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:gap-12">
                    {/* Danger Side */}
                    <div className="bg-[#fffdfd] border border-red-100 p-4 md:p-12 rounded-[20px] md:rounded-[32px] relative overflow-hidden group transition-all duration-500 hover:shadow-xl hover:border-red-200">
                      <div className="absolute top-0 right-0 w-24 h-24 md:w-48 md:h-48 bg-red-50 rounded-full blur-2xl md:blur-3xl -mr-8 -mt-8 md:-mr-16 md:-mt-16 transition duration-700 group-hover:scale-150"></div>
                      <div className="relative z-10">
                        <div className="w-8 h-8 md:w-14 md:h-14 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center text-sm md:text-2xl mb-4 md:mb-8 shadow-sm">⚠️</div>
                        <h3 className="text-sm md:text-2xl font-extrabold text-gray-900 mb-2 md:mb-4">The Silent Dangers of Chemical Fertilizers</h3>
                        <p className="text-gray-600 mb-4 md:mb-8 leading-tight md:leading-relaxed text-[9px] md:text-base">
                          Conventional farming relies heavily on synthetic urea, toxic pesticides, and chemical herbicides. These don't just wash off in the sink—they absorb directly into the cellular structure of the crops you consume daily.
                        </p>
                        <ul className="space-y-3 md:space-y-6">
                          {[
                            { title: 'Endocrine Disruption', desc: 'Chemical pesticide residues act as hormone disruptors in the human body, heavily linked to severe metabolic imbalances and developmental issues in children.' },
                            { title: 'Chronic & Severe Diseases', desc: 'Long-term accumulation of synthetic fertilizer residues is scientifically associated with significantly increased risks of neurodegenerative diseases and certain forms of cancer.' },
                            { title: 'Severe Nutrient Depletion', desc: 'Chemicals rapidly degrade the soil biome. The result? Vegetables that look artificially large but are completely stripped of essential trace minerals and natural taste.' }
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-red-100 flex items-center justify-center mr-2 md:mr-4 mt-0.5 shrink-0">
                                <span className="text-red-500 text-[7px] md:text-[10px] font-black">✕</span>
                              </div>
                              <div>
                                <span className="block font-bold text-gray-900 text-[10px] md:text-base mb-0.5 md:mb-1">{item.title}</span>
                                <span className="block text-[8px] md:text-sm text-gray-500 leading-tight md:leading-relaxed">{item.desc}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Organic Side */}
                    <div className="bg-[#f7fada] border border-[#d6e8a0] p-4 md:p-12 rounded-[20px] md:rounded-[32px] shadow-lg relative overflow-hidden group transition-all duration-500 hover:shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#D4A373] opacity-20 rounded-full blur-2xl md:blur-3xl -mr-8 -mt-8 md:-mr-16 md:-mt-16 transition duration-700 group-hover:scale-150"></div>
                      <div className="relative z-10">
                        <div className="w-8 h-8 md:w-14 md:h-14 bg-white text-[#5b7a2d] shadow-sm rounded-full flex items-center justify-center text-sm md:text-2xl mb-4 md:mb-8">🌿</div>
                        <h3 className="text-sm md:text-2xl font-extrabold text-gray-900 mb-2 md:mb-4">The Healing Power of True Organic</h3>
                        <p className="text-gray-700 mb-4 md:mb-8 leading-tight md:leading-relaxed text-[9px] md:text-base">
                          True organic farming works in perfect harmony with nature. By nurturing the soil microbiome with cow dung manure, Jeevamrut, and vermicompost, we cultivate crops that actively heal and nourish your body.
                        </p>
                        <ul className="space-y-3 md:space-y-6">
                          {[
                            { title: 'Rich Antioxidant Profiles', desc: 'Organically grown plants are proven to produce up to 60% more natural antioxidants, actively protecting your cells from premature aging and oxidative stress.' },
                            { title: 'Natural Immunity Boosting', desc: 'Completely free from toxic interference, organic foods naturally support a healthy gut microbiome, which serves as the absolute foundation of a strong human immune system.' },
                            { title: 'Superior Nutrient Density', desc: 'Our traditional, unhurried farming methods ensure every single vegetable is densely packed with highly bioavailable vitamins, iron, and crucial earth minerals.' }
                          ].map((item, i) => (
                            <li key={i} className="flex items-start">
                              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#D4A373] flex items-center justify-center mr-2 md:mr-4 mt-0.5 shrink-0">
                                <span className="text-[#1a2a1e] text-[7px] md:text-[10px] font-black">✓</span>
                              </div>
                              <div>
                                <span className="block font-bold text-gray-900 text-[10px] md:text-base mb-0.5 md:mb-1">{item.title}</span>
                                <span className="block text-[8px] md:text-sm text-gray-700 leading-tight md:leading-relaxed">{item.desc}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* 6. Testimonials */}
              <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#f7f6ee] to-white">
                <div className="max-w-7xl mx-auto text-center">
                  <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-4">MEMBER STORIES</span>
                  <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-16">Trusted by families.</h3>

                  <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-8 text-left pb-8 -mx-6 px-6 md:mx-0 md:px-0">
                    {[
                      { name: 'Rahul Sharma', plan: 'Family Member', txt: 'Knowing exactly where my vegetables come from has completely changed our diets. The weekly photos are something my kids look forward to!' },
                      { name: 'Priya Patel', plan: 'Premium Member', txt: 'The farm visits on weekends are therapeutic. The quality of grains and fruits is significantly better than anything at the organic supermarkets.' },
                      { name: 'Ananya & Raj', plan: 'Elite Members', txt: 'Having our own farm manager who customizes crops based on our exact dietary needs is a luxury that has become a necessity for us.' }
                    ].map((t, i) => (
                      <div key={i} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 w-[80vw] min-w-[260px] md:w-auto md:min-w-0 flex-shrink-0 snap-center">
                        <div className="flex text-yellow-400 text-[10px] md:text-xs tracking-widest mb-3 md:mb-4">★★★★★</div>
                        <p className="text-gray-600 italic mb-4 md:mb-6 text-sm md:text-base leading-relaxed">"{t.txt}"</p>
                        <div className="border-t border-gray-100 pt-3 md:pt-4">
                          <span className="block font-bold text-gray-900 text-xs md:text-sm">{t.name}</span>
                          <span className="block font-semibold text-agri-green-mid text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5 md:mt-1">{t.plan}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 7. FAQ */}
              <section className="py-20 px-6 md:px-12 bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-tight mb-12">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {[
                      { q: 'How much produce will I receive?', a: 'Yield varies by season and plan size, but an average Family Plan yields enough seasonal vegetables to sustain a family of 4 every week.' },
                      { q: 'Can I visit my farm?', a: 'Yes! Premium and Elite members have farm visits included. Family plan members can book guided tours.' },
                      { q: 'What crops are grown?', a: 'We grow seasonal vegetables natively suited to the local climate. Premium/Elite plans include fruits and grains.' },
                      { q: 'Is the farming certified organic?', a: 'Absolutely. We use zero synthetic chemicals. All soil and produce undergo regular organic certification checks.' },
                      { q: 'Can I customize crops?', a: 'Elite members can fully customize their crop selection in consultation with their dedicated farm manager.' },
                      { q: 'How often do I get updates?', a: 'You receive weekly photos, videos, and growth reports directly in your dashboard.' },
                      { q: 'What if crops fail?', a: 'Farming is subject to nature. However, our vast ecosystem allows us to buffer minor failures from aggregate reserves so you never go empty-handed.' }
                    ].map((faq, i) => (
                      <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <button
                          className="w-full text-left p-6 font-bold text-gray-900 flex justify-between items-center focus:outline-none"
                          onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        >
                          {faq.q}
                          <span className={`text-[#D4A373] text-xl font-black transition-transform ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                        </button>
                        {faqOpen === i && (
                          <div className="p-6 pt-0 text-sm text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 8. Final CTA */}
              <section className="py-24 px-6 md:px-12 bg-[#2c3e2d] text-center">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Your Organic Farm Is Waiting</h2>
                  <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                    Join thousands of families who know exactly where their food comes from. Transparent, organic, and delivered fresh.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-[#D4A373] text-[#1a2a1e] rounded-full font-extrabold text-sm hover:bg-white transition shadow-xl">
                      Become a Member
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white rounded-full font-extrabold text-sm border border-white hover:bg-white/10 transition">
                      Schedule a Farm Tour
                    </button>
                  </div>
                </div>
              </section>

            </div>

          </div>
        )}

        {/* VIEW 2: SCIENCE */}
        {routePath === '#science' && (
          <div className="py-6 md:py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">RESEARCH METHODOLOGY</span>
            <h1 className="text-2xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">
              Science and Field Validation
            </h1>
            <p className="text-gray-600 text-xs md:text-base max-w-2xl leading-relaxed mb-8">
              At Agriic, botanical biology is not a marketing hook. Read how we design precision soil restoration programs through active trial iterations.
            </p>

            <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 mb-10 pb-4">
              {[
                { title: 'Soil Extraction Map', text: 'We start by extracting complete trace element metrics—specifically evaluating primary mineral depletion levels.' },
                { title: 'Ayurvedic Hybrid Blends', text: 'We enrich active compound isolates (like cold-pressed seaweed micellar enzymes) directly into organic mineral bases.' },
                { title: 'Independent Verification', text: 'Third-party validation verifies final leaf health indexes, crop root weight expansion ratios, and lasting soil biomes.' }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 p-3.5 rounded-2xl shadow-sm bg-white hover:shadow-md transition min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-black text-agri-lime block mb-1">0{index + 1}</span>
                    <h3 className="font-extrabold text-[11px] text-slate-900 mb-1 leading-tight line-clamp-1">{item.title}</h3>
                    <p className="text-[9px] text-gray-505 leading-normal line-clamp-5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Before after cards */}
            <div className="bg-agri-cream p-4 md:p-10 rounded-2xl md:rounded-[32px] mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 md:mb-6 text-center md:text-left">Longitudinal Case Studies</h2>
              <div className="flex flex-row overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 pb-4">
                {[
                  {
                    farmer: 'Amit Deshmukh (Pune District)',
                    crop: 'Pomegranate Growth',
                    before: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=350&q=80',
                    after: 'https://images.unsplash.com/photo-1610341592771-74946011232f?auto=format&fit=crop&w=350&q=80',
                    desc: 'Soil pH recovery from 5.4 back to balanced 6.7 in just 120 days. Fruit output weight increased by active 42%.'
                  },
                  {
                    farmer: 'Vikas Patel (Anand District)',
                    crop: 'Leaf Nitrogen Density',
                    before: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=350&q=80',
                    after: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=350&q=80',
                    desc: 'Nitrogen levels balanced. Soil moisture capacity increased by 33%, securing crops against dry hot bursts.'
                  }
                ].map((caseStudy, index) => (
                  <div key={index} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-150 flex flex-col justify-between min-w-[150px] max-w-[150px] md:min-w-0 flex-shrink-0 snap-start">
                    <div>
                      <h3 className="font-extrabold text-[11px] md:text-sm text-gray-900 mb-0.5 line-clamp-1">{caseStudy.farmer}</h3>
                      <span className="text-[9px] md:text-[11px] font-bold text-agri-green-mid block mb-2 leading-tight line-clamp-1">{caseStudy.crop}</span>
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <div>
                          <span className="text-[8px] text-slate-400 block mb-0.5 uppercase font-mono truncate">BEFORE</span>
                          <img src={caseStudy.before} className="rounded-lg h-14 md:h-24 w-full object-cover" alt="Before" />
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-400 block mb-0.5 uppercase font-mono truncate font-semibold">AFTER</span>
                          <img src={caseStudy.after} className="rounded-lg h-14 md:h-24 w-full object-cover" alt="After" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] md:text-[11px] text-gray-600 leading-normal line-clamp-3 md:line-clamp-none">{caseStudy.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-agri-dark to-agri-green-mid text-white p-6 md:p-12 rounded-2xl md:rounded-3xl text-center">
              <h3 className="text-xl md:text-2xl font-extrabold mb-3">Ready to test your soil baseline?</h3>
              <p className="text-white/80 max-w-sm mx-auto text-[11px] md:text-xs leading-relaxed mb-5">Receive a custom mineral and composition breakdown analysis through our direct digital Soil Test™ quiz.</p>
              <a href="#soil-test" className="bg-agri-lime text-[#2D5A3F] font-black text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform inline-block uppercase">Start diagnostic free</a>
            </div>
          </div>
        )}

        {/* VIEW 3: ABOUT US */}
        {routePath === '#about' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">OUR BOTANICS MISSION</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-6 tracking-tight">Rooted in science, grown for India</h1>

            <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6 text-sm mb-12">
              <p>
                Agriic was established in Vapi, Gujarat with a primary mission: to provide Indian agriculture with customized, soil-specific organic plant nutrition solutions.
              </p>
              <p>
                By avoiding typical synthetic nitrates that permanently crystallize the topsoil, our slow-release recipes integrate trace botanical enzymes to maintain soil porosity and balanced biological biomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border">
                <h3 className="font-extrabold text-[#2b3a30] text-sm mb-2">Ayurvedic Insight</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">We utilize traditional plant food protocols like neem cake, mustard oil hulls, and alfalfa compounds to construct organic defense.</p>
              </div>
              <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border">
                <h3 className="font-extrabold text-[#2b3a30] text-sm mb-2">Contemporary Science</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">Controlled laboratory extractions of fulvic and humic chains ensure our mixes release micronutrients consistently.</p>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Our Journey</h2>
            <div className="space-y-6 relative border-l border-gray-200 pl-6 ml-2">
              {[
                { year: '2019', title: 'Founded with Soil Testing Focus', desc: 'Initially built custom testing kits for state-level co-ops.' },
                { year: '2021', title: 'Formulations validation', desc: 'Completed 300 controlled farm validation iterations with state botanical councils.' },
                { year: '2023', title: 'Farmer Network Reaches 5L', desc: 'Opened centers in Bangalore, Hyderabad, and Nagpur to meet direct requests.' },
                { year: '2026', title: 'Direct consumer launch', desc: 'Making professional agricultural-grade custom blends accessible directly to home gardeners.' }
              ].map((milestone, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-agri-green-mid border-2 border-white ring-4 ring-agri-cream"></span>
                  <span className="block text-xs font-black text-agri-green-mid mb-1">{milestone.year}</span>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: liveProducts */}
        {routePath === '#products' && (
          <ShopModule
            liveProducts={liveProducts}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            allProductsSearch={allProductsSearch}
            setAllProductsSearch={setAllProductsSearch}
            cart={cart}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
            currentUser={currentUser}
            handleLogout={handleLogout}
            isCartDrawerOpen={isCartDrawerOpen}
            setIsCartDrawerOpen={setIsCartDrawerOpen}
          />
        )}

        {/* VIEW 5: PRODUCT DETAIL */}
        {/* VIEW 5: PRODUCT DETAIL */}
        {routePath === '#product' && (
          <div className="py-12 px-4 md:px-12 bg-[#FBFBFA] min-h-screen">
            {(() => {
              const prodId = routeParams.id;
              const product = liveProducts.find(p => p.id === prodId);

              if (!product) {
                return (
                  <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-xl mx-auto px-6">
                    <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Product Not Found</h2>
                    <p className="text-sm text-gray-500 mb-6">The item you searched for could not be traced.</p>
                    <a href="#products" className="inline-block bg-[#2D5A3F] text-white font-black text-xs px-6 py-3 rounded-full hover:bg-[#2d5a3d] transition-all uppercase tracking-wider shadow">Browse All Products</a>
                  </div>
                );
              }

              // Related products
              const related = liveProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
              const selectedSize = selectedSizes[product.id] || (product.sizes && product.sizes[0]) || 'Standard';
              const cartItem = cart.find(item => item.product.id === product.id);
              const cartQty = cartItem ? cartItem.qty : 0;

              return (
                <div className="max-w-6xl mx-auto">
                  {/* Breadcrumb Trail */}
                  <nav className="flex items-center space-x-2 text-xs font-bold text-slate-400 mb-8 overflow-x-auto no-scrollbar py-1">
                    <a href="#home" className="hover:text-[#2D5A3F] transition-colors">Home</a>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <a href="#products" className="hover:text-[#2D5A3F] transition-colors">Shop</a>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="capitalize">{product.category.replace('-', ' ')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-800 font-extrabold line-clamp-1">{product.name}</span>
                  </nav>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 mb-16 bg-white p-6 md:p-10 rounded-[32px] border border-gray-100 shadow-[0px_8px_30px_0px_rgba(55,115,85,0.06)] relative overflow-hidden">
                    {/* Floating ambient glow in container */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#2D5A3F]/5 blur-3xl pointer-events-none" />

                    {/* Left side Image container (5 cols) */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                      <div className="relative bg-gradient-to-br from-[#fbfbf9] to-[#e8f5ee]/40 rounded-[28px] p-8 flex items-center justify-center min-h-[300px] md:min-h-[380px] border border-emerald-100/50 shadow-inner group overflow-hidden">
                        {/* Radial light behind image */}
                        <div className="absolute w-48 h-48 rounded-full bg-[#2D5A3F]/8 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

                        <img
                          src={product.img}
                          className="max-h-72 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-500 z-10"
                          alt={product.name}
                        />

                        {/* Floating organic badge */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-emerald-100 text-[#2D5A3F] text-[9px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-[#2D5A3F]" /> 100% ORGANIC
                        </div>
                      </div>

                      {/* Mini trust checklist under image */}
                      <div className="grid grid-cols-2 gap-3 bg-[#fbfbfa] p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-600">Lab Tested Pure</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-600">Pesticide Free</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-600">Direct Farm Sourced</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full p-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-600">Eco-Friendly Pack</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side detail fields (7 cols) */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div>
                        {/* Category badge */}
                        <span className="bg-[#e8f5ee] text-[#2D5A3F] text-[10px] font-black px-3 py-1 rounded-full w-max block uppercase mb-4 tracking-wider">
                          🌿 {product.category.replace('-', ' & ')}
                        </span>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 leading-tight mb-3 tracking-tight">
                          {product.name}
                        </h1>

                        {/* Star Rating list */}
                        <div className="flex items-center space-x-3 mb-6 bg-slate-50 border border-gray-100 w-max px-3 py-1.5 rounded-full">
                          <div className="flex items-center text-amber-400 gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-600 font-extrabold">{product.rating || '4.8'}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-[10px] text-gray-500 font-bold">124 Verified Buyer Reviews</span>
                        </div>

                        {/* Price box */}
                        {(() => {
                          const displayOriginalPrice = product.originalPrice || Math.round(product.price / 0.9);
                          const discountPercent = Math.round(((displayOriginalPrice - product.price) / displayOriginalPrice) * 100);
                          return (
                            <div className="flex items-baseline space-x-3 mb-6 bg-[#fbfbfa] p-4 rounded-2xl border border-gray-100 w-max">
                              <span className="text-2xl md:text-3xl font-black text-slate-900">₹{product.price}</span>
                              <span className="text-sm text-gray-400 line-through font-semibold">₹{displayOriginalPrice}</span>
                              <span className="text-xs font-black text-[#2D5A3F] bg-[#e8f5ee] px-2.5 py-1 rounded-lg">
                                Save ₹{displayOriginalPrice - product.price} ({discountPercent}% off)
                              </span>
                            </div>
                          );
                        })()}

                        {/* Product Description */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-8">
                          {product.desc} Our certified organic plant solutions are sourced responsibly from local growers using zero chemical fertilizers. Guaranteed to keep your soil health and natural nutrition intact.
                        </p>

                        {/* Size selector buttons (upgraded from dropdown) */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mb-8">
                            <span className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">Select Pack Size:</span>
                            <div className="flex flex-wrap gap-2.5">
                              {product.sizes.map(size => {
                                const isSelected = selectedSize === size;
                                return (
                                  <button
                                    key={size}
                                    onClick={() => setSelectedSizes({ ...selectedSizes, [product.id]: size })}
                                    className={`px-5 py-2.5 text-xs font-extrabold rounded-xl border transition-all ${isSelected
                                        ? 'bg-[#2D5A3F] text-white border-[#2D5A3F] shadow-md shadow-[#2D5A3F]/15'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#2D5A3F] hover:text-[#2D5A3F]'
                                      }`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Add to cart or Stepper controls */}
                      <div className="border-t border-gray-100 pt-6">
                        {cartQty === 0 ? (
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-full bg-[#2D5A3F] hover:bg-[#2d5a3d] text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" /> ADD TO CART • ₹{product.price}
                          </button>
                        ) : (
                          <div className="flex items-center gap-4">
                            {/* Stepper container */}
                            <div className="flex items-center bg-[#2D5A3F] text-white rounded-2xl overflow-hidden h-[52px] shadow-md border border-[#2D5A3F]">
                              <button
                                onClick={() => updateCartQty(product.id, cartQty - 1)}
                                className="w-14 h-full flex items-center justify-center hover:bg-[#2d5a3d] transition-colors text-white/80 hover:text-white"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-black text-sm select-none">{cartQty} in cart</span>
                              <button
                                onClick={() => updateCartQty(product.id, cartQty + 1)}
                                className="w-14 h-full flex items-center justify-center hover:bg-[#2d5a3d] transition-colors text-white/80 hover:text-white"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            {/* Secondary view cart link */}
                            <a
                              href="#cart"
                              className="flex-1 bg-[#e8f5ee] hover:bg-[#2D5A3F] text-[#2D5A3F] hover:text-white font-black py-4 rounded-2xl text-center text-xs tracking-wider uppercase transition-colors"
                            >
                              Go to cart 🛒
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Accordions */}
                      <div className="mt-8 space-y-3.5">
                        {[
                          { id: 'sourcing', title: 'Sourcing & Quality Guarantee', txt: 'Sourced from certified pesticide-free organic farms in India. Hand-harvested, cleaned, and processed to keep all natural flavor and biological values intact.' },
                          { id: 'nutrition', title: 'Nutritional Information & Benefits', txt: '100% natural, gluten-free, and rich in natural dietary fiber and minerals. Free from artificial colors, preservatives, and bleaching agents.' },
                          { id: 'shipping', title: 'Fresh Packaging & Safe Delivery', txt: 'Packed in eco-friendly zip-lock bags to preserve shelf life and aroma. Free dispatch across India for all carts above ₹499.' }
                        ].map(acc => {
                          const isOpen = openAccordion === acc.id;
                          return (
                            <div key={acc.id} className="border-b border-slate-100 pb-3">
                              <button
                                onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                                className="w-full flex items-center justify-between text-left focus:outline-none py-2"
                              >
                                <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">{acc.title}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isOpen && (
                                <p className="text-xs text-gray-500 leading-relaxed mt-2 animate-fade-in pl-1">
                                  {acc.txt}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── LUXURY ADDITION 1: ACTIVE BOTANICAL INGREDIENTS SHOWCASE ── */}
                  <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-10 mb-16 shadow-[0px_8px_30px_0px_rgba(55,115,85,0.04)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#D4A373]/5 blur-3xl pointer-events-none" />

                    <div className="mb-8">
                      <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.25em] mb-1">🔬 Science-Led Nutrition</p>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800">Active Bio-Ingredients</h3>
                      <div className="mt-2 w-10 h-[3px] rounded-full bg-[#D4A373]" />
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                      {[
                        { name: 'Seaweed Kelp Extract', origin: 'Direct Coastal Sourced', benefits: 'Stimulates root growth & triggers internal plant defense pathways against heat and stress.', color: 'bg-emerald-50 text-emerald-800 border-emerald-100/50' },
                        { name: 'Premium Humic Acids', origin: 'Eco-Degraded Forest Soil', benefits: 'Maximizes soil mineral intake, unlocking trapped trace elements and nitrogen loops.', color: 'bg-amber-50 text-amber-900 border-amber-100/50' },
                        { name: 'Neem Cake Concentrate', origin: 'Cold-Pressed Seed Kernels', benefits: 'Acts as a natural systemic barrier, shielding tender root layers from nematodes.', color: 'bg-teal-50 text-teal-800 border-teal-100/50' },
                        { name: 'Alfalfa Meal Bio-Booster', origin: 'Certified Organic Legumes', benefits: 'Delivers natural triacontanol growth regulators for lush leaf canopy expansions.', color: 'bg-lime-50 text-lime-900 border-lime-100/50' },
                      ].map((ing, i) => (
                        <div key={i} className={`p-5 rounded-2xl border ${ing.color} flex flex-col justify-between hover:scale-[1.02] transition-transform flex-shrink-0 w-[240px] md:w-auto`}>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75 mb-1">{ing.origin}</span>
                            <h4 className="font-extrabold text-sm mb-3 leading-snug">{ing.name}</h4>
                            <p className="text-[11px] leading-relaxed opacity-90 font-medium">{ing.benefits}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── LUXURY ADDITION 2: LIVE ECO-IMPACT TICKER ── */}
                  <div className="relative overflow-hidden rounded-[32px] p-6 md:p-8 mb-16 bg-[#122e1f] text-white shadow-[0_12px_40px_rgba(18,46,31,0.25)]">
                    {/* Subtle dot pattern background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#D4A373]/10 blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <span className="text-[9px] font-black text-[#D4A373] uppercase tracking-[0.2em] block mb-1">🌿 Conscious Living</span>
                        <h4 className="text-lg font-black tracking-tight">Our Collective Ecological Footprint</h4>
                        <p className="text-xs text-white/50 font-semibold mt-1">Every purchase supports sustainable chemical-free soil restoration.</p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {[
                          { val: '14,240 kg', label: 'Chemicals Replaced' },
                          { val: '82,000 sqm', label: 'Soil Restored' },
                          { val: '98%', label: 'Plastic-Free Packs' },
                        ].map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className="text-xl md:text-2xl font-black text-[#5ecb8e]">{stat.val}</div>
                            <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Related items */}
                  {related.length > 0 && (
                    <div className="border-t border-gray-100 pt-12">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Other Organic Products</h3>
                          <div className="mt-1.5 w-8 h-[3px] rounded-full bg-[#D4A373]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                        {related.map((rp) => {
                          const rpQty = cart.find(item => item.product.id === rp.id)?.qty || 0;
                          return (
                            <div key={rp.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden p-3">
                              {/* Image */}
                              <div className="relative h-28 md:h-36 bg-[#f7f7f5] flex items-center justify-center p-2 cursor-pointer rounded-xl mb-3" onClick={() => window.location.hash = `#product?id=${rp.id}`}>
                                <img src={rp.img} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" alt={rp.name} />
                                {rp.badge && (
                                  <span className="absolute top-1.5 left-1.5 bg-[#2D5A3F] text-white text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">{rp.badge}</span>
                                )}
                              </div>
                              {/* Info */}
                              <div className="flex flex-col flex-1">
                                <h4 className="font-extrabold text-[11px] md:text-xs text-slate-800 hover:text-[#2D5A3F] transition-colors leading-tight line-clamp-2 mb-2 cursor-pointer" onClick={() => window.location.hash = `#product?id=${rp.id}`}>
                                  {rp.name}
                                </h4>
                                <div className="mt-auto flex items-center justify-between pt-1 border-t border-gray-50">
                                  <span className="font-black text-slate-900 text-xs">₹{rp.price}</span>
                                  {rpQty === 0 ? (
                                    <button
                                      onClick={() => addToCart(rp, 1)}
                                      className="bg-[#e8f5ee] text-[#2D5A3F] hover:bg-[#2D5A3F] hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black shadow-sm transition-colors uppercase tracking-wide"
                                    >
                                      ADD
                                    </button>
                                  ) : (
                                    <div className="flex items-center bg-[#2D5A3F] text-white rounded-lg overflow-hidden h-[24px] border border-[#2D5A3F]">
                                      <button onClick={() => updateCartQty(rp.id, rpQty - 1)} className="px-2 h-full flex items-center justify-center hover:bg-[#2d5a3d] transition-colors text-white"><Minus className="w-2.5 h-2.5" /></button>
                                      <span className="px-1 text-center font-black text-[10px]">{rpQty}</span>
                                      <button onClick={() => updateCartQty(rp.id, rpQty + 1)} className="px-2 h-full flex items-center justify-center hover:bg-[#2d5a3d] transition-colors text-white"><Plus className="w-2.5 h-2.5" /></button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 6: SOIL TEST */}
        {routePath === '#soil-test' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-3xl mx-auto">
            {!quizCompleted ? (
              <div className="bg-[#f7f6ee] p-6 md:p-10 rounded-[32px] border border-agri-cream-border shadow-sm">
                <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-1">DIAGNOSTIC TEST</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">The Soil Test™</h1>
                <p className="text-xs text-gray-550 mb-8 max-w-md leading-relaxed">
                  Analyze your baseline nutrient deficiencies to generate a customized kit recommendation. Answer 5 easy questions.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full mb-2 overflow-hidden">
                  <div
                    className="bg-agri-lime-alt h-full transition-all duration-300"
                    style={{ width: `${((quizStep + 1) / liveQuizQuestions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 font-bold mb-8">
                  <span>STEP {quizStep + 1} OF 5</span>
                  <span>{Math.round(((quizStep + 1) / liveQuizQuestions.length) * 100)}% COMPLETE</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 mb-6">{liveQuizQuestions[quizStep].question}</h3>
                  <div className="space-y-3">
                    {liveQuizQuestions[quizStep].options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[quizStep] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            const updated = [...quizAnswers];
                            updated[quizStep] = optIdx;
                            setQuizAnswers(updated);
                          }}
                          className={`w-full text-left p-4.5 rounded-xl border text-xs font-bold leading-tight transition-all flex items-center justify-between ${isSelected
                            ? 'bg-white border-agri-lime text-agri-dark ring-2 ring-agri-lime/20'
                            : 'bg-white border-gray-250 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-agri-lime bg-agri-lime' : 'border-gray-300'}`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#2D5A3F]"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center-pt-4">
                  {quizStep > 0 ? (
                    <button
                      onClick={() => setQuizStep(quizStep - 1)}
                      className="text-xs font-bold text-gray-500 hover:text-black transition"
                    >
                      ← Back
                    </button>
                  ) : <div></div>}

                  <button
                    onClick={() => {
                      if (quizStep < liveQuizQuestions.length - 1) {
                        setQuizStep(quizStep + 1);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    disabled={quizAnswers[quizStep] === undefined}
                    className={`px-6 py-3.5 rounded-xl text-xs font-extrabold tracking-wider ${quizAnswers[quizStep] !== undefined
                      ? 'bg-agri-dark text-white cursor-pointer hover:bg-black'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {quizStep === liveQuizQuestions.length - 1 ? 'See Recommendations' : 'Next Question →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 p-6 md:p-10 rounded-[32px] text-center shadow-lg animate-fade-in text-gray-900">
                <div className="w-16 h-16 bg-agri-lime/30 rounded-full flex items-center justify-center text-agri-dark mx-auto mb-6">
                  <Check className="w-8 h-8 text-agri-dark" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Diagnostic Analysis Complete!</h1>
                <p className="text-xs text-gray-650 max-w-sm mx-auto mb-8 leading-normal">
                  Our system matched your answers to target deficiencies. We recommend the following starter mixture based on your crop selections.
                </p>

                <div className="border border-[#e2e1d7] p-5 rounded-2xl bg-slate-50 text-left mb-8 max-w-md mx-auto">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={liveProducts[0].img} className="w-12 h-12 object-cover rounded-lg bg-white p-1 border" alt="Core NPK" />
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{liveProducts[0].name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{liveProducts[0].desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center-pt-2 border-t border-slate-100 mt-2">
                    <span className="font-extrabold text-slate-800 text-sm">₹ {liveProducts[0].price}</span>
                    <button
                      onClick={() => addToCart(liveProducts[0], 1)}
                      className="bg-[#2b3a30] text-agri-lime hover:bg-black font-black text-[10px] tracking-wider px-3 py-1.5 rounded-md"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setQuizStep(0);
                      setQuizAnswers([]);
                      setQuizCompleted(false);
                    }}
                    className="text-xs text-gray-550 hover:text-black tracking-wide font-extrabold underline"
                  >
                    Retake Soil Test™
                  </button>
                  <span>|</span>
                  <a href="#products" className="text-xs text-agri-green-mid hover:underline font-extrabold">Shop complete kit</a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 7: GROWING BLOG */}
        {routePath === '#blog' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-7xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid tracking-widest block uppercase mb-2">EDUCATIONAL HUB</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">Stay rooted in botany</h1>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-12">Learn top gardening practices, soil microbial mechanics, and seasonal vegetable timing from our specialists.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {liveBlogPosts.map((post, index) => (
                <div key={index} className="border border-gray-150 rounded-[24px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <img src={post.img} className="h-48 w-full object-cover" alt={post.title} />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-[10px] font-extrabold text-agri-green-mid mb-2 uppercase tracking-widest bg-agri-cream px-2 py-0.5 rounded w-fit">
                      <span>{post.category}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-905 mb-2 leading-tight">{post.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3 border-t border-slate-50 font-semibold">
                      <span>{post.date}</span>
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-[#f7f6ee] p-8 md:p-12 rounded-[32px] mt-16 text-center max-w-3xl mx-auto border border-[#e2e1d7]/60">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Subscribe to Agriic Digest</h3>
              <p className="text-xs text-gray-550 max-w-md mx-auto mb-6">Receive seasonal crop guidance, localized soil alerts, and exclusive discounts directly in your inbox.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsEmail) {
                    showToastMsg('Subscription success! Check your inbox soon.');
                    setNewsEmail('');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-white border border-gray-300 px-4 py-3 rounded-xl flex-1 text-slate-800 text-xs font-semibold focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-agri-dark text-white font-extrabold text-xs px-6 py-3.5 rounded-xl hover:bg-black transition whitespace-nowrap"
                >
                  Join Newsletter
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 8: ABOUT / HOW TO CONTACT */}
        {routePath === '#contact' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            <span className="text-xs font-black text-agri-green-mid uppercase tracking-widest block mb-2">DIRECT COMMUNICATION</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-4 tracking-tight">Consult with our advisors</h1>
            <p className="text-sm text-gray-600 mb-10 max-w-md lead-relaxed">We provide responsive, direct advice. Send a custom enquiry about crop health or order problems.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Form panel */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToastMsg('Message received. Our advisor will return with research data soon.');
                  setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone (Format)</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+91"
                      className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                    required
                  >
                    <option value="">Choose a subject...</option>
                    <option value="soil">Soil test support enquiries</option>
                    <option value="product">Product composition questions</option>
                    <option value="wholesale">Commercial and bulk purchases</option>
                    <option value="delivery">Shipping query</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Enquiry</label>
                  <textarea
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide details about your soil or crop type..."
                    rows={4}
                    className="w-full bg-slate-50 border border-gray-250 p-3 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-agri-dark text-[#D4A373] font-black tracking-wider text-xs px-6 py-4.5 rounded-xl hover:bg-black transition-colors"
                >
                  SEND ADVICE ENQUIRY
                </button>
              </form>

              {/* Direct ways details */}
              <div className="space-y-6">
                <div className="bg-[#f7f6ee] p-6 rounded-2xl border border-[#e2e1d7]">
                  <h3 className="font-extrabold text-sm text-[#2b3a30] mb-2 flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-agri-green-mid" />
                    <span>WhatsApp support centre</span>
                  </h3>
                  <p className="text-xs text-gray-650 leading-relaxed font-normal mb-4">
                    Send photos of your crops directly to our botanical advisors. We will review leaf spot damages immediately.
                  </p>
                  <a
                    href="https://wa.me/918047863601"
                    target="_blank"
                    rel="noopener"
                    className="bg-[#25D366] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg inline-flex items-center space-x-2 shadow-sm"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 mb-3">Service Locations</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Bengaluru', 'Pune', 'Nagpur', 'Chennai', 'Vapi (Regd. Office)', 'Mumbai (HQ)'].map((city, idx) => (
                      <span key={idx} className="bg-agri-cream text-gray-700 border border-agri-cream-border text-[11px] font-semibold px-3.5 py-1.5 rounded-md">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p className="font-bold">Agriic Solutions Pvt. Ltd.</p>
                  <p className="mt-1">Unit no - 101, B wing, building - 16, Interface, Off Link Road, Malad (West), Mumbai - 400064</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 9: CART */}
        {routePath === '#cart' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-[#2b3a30] mb-2 tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-gray-500 mb-8">{getCartCount()} items in basket</p>

            {cart.length === 0 ? (
              <div className="text-center py-16 bg-[#f7f6ee] rounded-3xl p-6 border">
                <ShoppingCart className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cart is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Explore our diagnostic mixtures to start crop recovery.</p>
                <a href="#products" className="btn-primary">Browse Shop Products</a>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="divide-y divide-gray-150">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4.5 flex items-center justify-between gap-4">
                      <img src={item.product.img} className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-1" alt={item.product.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-gray-900 truncate">{item.product.name}</h4>
                        <span className="text-[11px] text-gray-500 font-bold uppercase">{item.product.category}</span>
                      </div>

                      <div className="flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                          className="p-1 hover:text-red-500 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.qty + 1)}
                          className="p-1 hover:text-agri-green-mid transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right w-20">
                        <span className="font-extrabold text-sm text-gray-950 block">₹ {item.product.price * item.qty}</span>
                        <span className="text-[10px] text-slate-400">₹ {item.product.price}/ea</span>
                      </div>

                      <button
                        onClick={() => updateCartQty(item.product.id, 0)}
                        className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Free shipping banner */}
                <div className="bg-agri-cream p-4 rounded-xl border border-agri-cream-border text-xs flex justify-between items-center">
                  {getSubtotal() >= 499 ? (
                    <span className="text-agri-green-mid font-bold flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Order qualifies for free secure shipping!</span>
                    </span>
                  ) : (
                    <span className="text-gray-650">
                      Add <strong>₹ {499 - getSubtotal()}</strong> more to unlock <strong>FREE secure shipping</strong>
                    </span>
                  )}
                  <span className="font-semibold text-slate-400">Secure packing guaranteed</span>
                </div>

                <div className="bg-[#f7f6ee] rounded-2xl p-6 md:p-8 mt-4 border border-[#e2e1d7] max-w-sm ml-auto">
                  <h3 className="font-black text-sm text-gray-900 border-b border-[#e2e1d7] pb-3 mb-4 uppercase">Subtotal Summary</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span className="font-bold text-gray-900">₹ {getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Estimated shipping</span>
                      <span className="font-bold text-gray-900">
                        {getSubtotal() >= 499 ? <span className="text-agri-green-mid">FREE</span> : '₹ 49'}
                      </span>
                    </div>
                    <div className="border-t border-[#e2e1d7] pt-3 flex justify-between font-black text-sm text-gray-950">
                      <span>Total Invoice</span>
                      <span>₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}</span>
                    </div>
                  </div>

                  <a
                    href={currentUser ? "#checkout" : "#auth"}
                    onClick={(e) => {
                      if (!currentUser) {
                        e.preventDefault();
                        showToastMsg("Please login to proceed to checkout.");
                        window.location.hash = "#auth";
                      }
                    }}
                    className="w-full text-center block bg-agri-dark text-white font-extrabold text-xs py-4.5 rounded-xl shadow-lg hover:bg-black transition-colors uppercase mt-6"
                  >
                    PROCEED TO CHECKOUT
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 10: CHECKOUT */}
        {routePath === '#checkout' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-5xl mx-auto">
            {!currentUser ? (
              <div className="text-center py-16 bg-[#f7f6ee] border border-gray-200 rounded-3xl p-6 max-w-md mx-auto">
                <User className="w-12 h-12 text-[#2b3a30] mx-auto mb-4" />
                <h3 className="text-lg font-black text-[#2D5A3F] mb-1">Authentication Required</h3>
                <p className="text-xs text-gray-500 mb-6">You must be logged in to securely place an order and track its delivery.</p>
                <a href="#auth" className="btn-primary inline-block">Sign In / Register</a>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 bg-[#f7f6ee] border border-gray-200 rounded-3xl p-6 max-w-md mx-auto">
                <ShoppingCart className="w-12 h-12 text-[#2b3a30] mx-auto mb-4" />
                <h3 className="text-lg font-black text-[#2D5A3F] mb-1">Cart is empty</h3>
                <p className="text-xs text-gray-500 mb-6">Explore our diagnostic mixtures to start crop recovery.</p>
                <a href="#products" className="btn-primary inline-block">Browse Shop Products</a>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Secure Checkout</h1>
                <p className="text-xs text-gray-400 mb-6 font-normal">Complete your organic soil biome restoration order parameters.</p>

                {/* AUTOFILL HELPER BANNER */}
                <div className="bg-[#f7f6ee] border border-dashed border-[#2D5A3F]/30 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h4 className="text-xs font-black text-[#2D5A3F] uppercase tracking-wide">Grower Profile Auto-fill</h4>
                      <p className="text-[11px] text-gray-500 leading-normal mt-0.5 font-normal">
                        {currentUser ? `Speed up dispatch with registered profile details: Name: "${currentUser.name || 'Alok'}", Phone: "${currentUser.phone || 'N/A'}", State: "${currentUser.location || 'N/A'}"` : 'Please register or log in to automatically load your location and phone metrics!'}
                      </p>
                    </div>
                  </div>
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutEmail(currentUser.email || '');
                        setCheckoutPhone(currentUser.phone || '');
                        setCheckoutFullname(currentUser.name || '');
                        setCheckoutState(currentUser.location || '');
                        showToastMsg('⚡ Successfully pre-loaded Address and Phone from Grower Profile!');
                      }}
                      className="bg-[#2D5A3F] hover:bg-black text-[#D4A373] hover:text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      Fill Profile Details
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Side forms */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const email = checkoutEmail || 'farmer@agriic.com';
                      const fullname = checkoutFullname || 'Alok Patel';
                      const street = checkoutStreet || '';
                      const pincode = checkoutPincode || '';
                      const city = checkoutCity || '';
                      const state = checkoutState || '';
                      const phone = checkoutPhone || '';

                      const newOrder: Order = {
                        id: `AGR-${Math.floor(10000 + Math.random() * 90000)}`,
                        farmerId: auth.currentUser ? auth.currentUser.uid : 'guest',
                        farmerName: fullname,
                        date: new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        }),
                        items: cart.map(item => ({
                          productId: item.product.id,
                          name: item.product.name,
                          price: item.product.price,
                          qty: item.qty,
                          img: item.product.img
                        })),
                        total: getSubtotal() + (getSubtotal() >= 499 ? 0 : 49),
                        status: 'Processing',
                        paymentMethod: paymentMethod,
                        address: `${street}, ${city}, ${state} - ${pincode}`
                      };

                      try {
                        // 1. Save to Firestore immediately to guarantee order persistence
                        await setDoc(doc(db, "orders", newOrder.id), newOrder);

                        // 2. Post to Shopify integration backend (API sends it to Shopify)
                        const shopifyPayload = {
                          email, phone, name: fullname, address: newOrder.address,
                          items: newOrder.items, total: newOrder.total, firebaseOrderId: newOrder.id
                        };

                        fetch('http://localhost:5000/create-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(shopifyPayload)
                        }).catch(err => console.warn('Shopify sync failed (Is backend running?):', err));

                        // 3. Update UI
                        setOrders([newOrder, ...orders]);
                        showToastMsg('Order placed successfully! Redirecting to tracking center.');
                        clearCart();
                        window.location.hash = '#profile';
                      } catch (error) {
                        console.error('Checkout error:', error);
                        showToastMsg('Failed to process order. Please try again.');
                      }
                    }}
                    className="lg:col-span-2 space-y-6"
                  >
                    {/* Contact details */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Contact Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={checkoutEmail}
                            onChange={e => setCheckoutEmail(e.target.value)}
                            placeholder="farmer@agriic.com"
                            className="w-full border p-3 text-xs font-semibold rounded-xl"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Mobile Phone</label>
                          <input
                            name="phone"
                            type="tel"
                            value={checkoutPhone}
                            onChange={e => setCheckoutPhone(e.target.value)}
                            placeholder="+91"
                            className="w-full border p-3 text-xs font-semibold rounded-xl"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Shipping Destination</h3>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">Complete Full Name</label>
                        <input
                          name="fullname"
                          type="text"
                          value={checkoutFullname}
                          onChange={e => setCheckoutFullname(e.target.value)}
                          placeholder="Add name"
                          className="w-full border p-3 text-xs font-semibold rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1">Street Address</label>
                        <input
                          name="street"
                          type="text"
                          value={checkoutStreet}
                          onChange={e => setCheckoutStreet(e.target.value)}
                          placeholder="Apartment, block, area details"
                          className="w-full border p-3 text-xs font-semibold rounded-xl"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">Pin Code</label>
                          <input
                            name="pincode"
                            type="text"
                            value={checkoutPincode}
                            onChange={e => setCheckoutPincode(e.target.value)}
                            placeholder="400001"
                            className="w-full border p-3 text-xs font-semibold rounded-xl"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">City</label>
                          <input
                            name="city"
                            type="text"
                            value={checkoutCity}
                            onChange={e => setCheckoutCity(e.target.value)}
                            placeholder="Mumbai"
                            className="w-full border p-3 text-xs font-semibold rounded-xl"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 block mb-1">State</label>
                          <input
                            name="state"
                            type="text"
                            value={checkoutState}
                            onChange={e => setCheckoutState(e.target.value)}
                            placeholder="Maharashtra"
                            className="w-full border p-3 text-xs font-semibold rounded-xl"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Method selection */}
                    <div className="border border-gray-200 p-6 rounded-2xl space-y-4">
                      <h3 className="font-extrabold text-slate-900 text-sm border-b pb-2 mb-2">Billing Method</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'card' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          Credit / Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'upi' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          UPI / QR Instant
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-4 rounded-xl border text-xs font-bold transition text-center ${paymentMethod === 'cod' ? 'border-agri-lime bg-[#f7f6ee]' : 'border-gray-250 bg-white'}`}
                        >
                          Cash on Delivery (COD)
                        </button>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-dashed mt-4">
                          <div>
                            <input type="text" placeholder="Card owner name" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                          <div>
                            <input type="text" placeholder="16-digit Card Number" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/YY" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                            <input type="password" placeholder="CVV" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl" required />
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'upi' && (
                        <div className="p-4 bg-[#f7f6ee] text-center rounded-xl font-bold text-xs text-agri-dark mt-4 border border-agri-cream-border">
                          🔒 Pay via GooglePay or PhonePe UPI address on the next interactive prompt.
                        </div>
                      )}

                      {paymentMethod === 'cod' && (
                        <div className="p-4 bg-yellow-50 text-center rounded-xl font-bold text-xs text-[#4e2b15] mt-4 border border-yellow-150">
                          📦 Pay securely when the local courier delivers bags to your destination.
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#2D5A3F] hover:bg-black text-white py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md"
                    >
                      PLACE SECURED ORDER • ₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}
                    </button>
                  </form>

                  {/* Right Side summary */}
                  <div>
                    <div className="bg-agri-cream p-6 rounded-2xl border border-agri-cream-border sticky top-24">
                      <h3 className="font-extrabold text-sm text-[#2b3a30] mb-4 uppercase border-b border-agri-cream-border pb-2">Items Summary</h3>
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar mb-4">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2">
                              <img src={item.product.img} className="w-8 h-8 object-cover rounded bg-white p-0.5 border" alt="Cart item pr" />
                              <span className="font-semibold text-gray-850 truncate max-w-32">{item.product.name}</span>
                              <span className="text-gray-400 font-bold ml-1">x{item.qty}</span>
                            </div>
                            <span className="font-bold text-slate-900">₹ {item.product.price * item.qty}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-agri-cream-border pt-4 text-xs space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹ {getSubtotal()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Estimated shipping</span>
                          <span>{getSubtotal() >= 499 ? 'FREE' : '₹ 49'}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-bold text-slate-800 pt-1 border-t">
                          <span>Total to pay</span>
                          <span>₹ {getSubtotal() + (getSubtotal() >= 499 ? 0 : 49)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 11: AUTHENTICATION */}
        {routePath === '#auth' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-sm mx-auto">
            <div className="bg-agri-cream p-6 rounded-3xl border border-agri-cream-border shadow-md">
              <div id="recaptcha-container"></div>

              {authMode === 'login' && (
                <>
                  <h1 className="text-xl font-black text-gray-905 mb-2 text-center uppercase tracking-wide">Sign In Back</h1>
                  <p className="text-[11px] text-gray-500 text-center mb-6 leading-normal">Access trace logs, orders histories, and Soil Test™ data.</p>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1">Email address</label>
                      <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1 font-mono">Password</label>
                      <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setAuthMode('forgot_password')} className="text-[10px] text-agri-green-mid font-bold hover:underline">Forgot Password?</button>
                    </div>
                    <button type="submit" className="w-full bg-[#2D5A3F] hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow">LOGIN USER</button>
                  </form>
                  <div className="mt-4">
                    <button onClick={handleGoogleSignIn} className="w-full bg-white border border-gray-200 text-slate-800 font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 shadow-sm transition-all"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" /><span>Sign in with Google</span></button>
                  </div>
                  <div className="mt-6 border-t pt-4 text-center">
                    <button onClick={() => setAuthMode('signup')} className="text-xs text-agri-green-mid hover:underline font-bold">Don't have an account? Sign up here</button>
                  </div>
                </>
              )}

              {authMode === 'signup' && (
                <>
                  <h1 className="text-xl font-black text-gray-905 mb-2 text-center uppercase tracking-wide">Create accounts</h1>
                  <p className="text-[11px] text-gray-500 text-center mb-6 leading-normal">Join the science-led farming nutrition network today.</p>
                  <button onClick={handleGoogleSignIn} className="w-full bg-white border border-gray-200 text-slate-800 font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 shadow-sm transition-all mb-4"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" /><span>Sign up with Google</span></button>
                  <p className="text-[10px] text-gray-500 text-center mb-6 leading-normal">We require Google Authentication and a mobile number to secure our farmer network.</p>
                  <div className="mt-6 border-t pt-4 text-center">
                    <button onClick={() => setAuthMode('login')} className="text-xs text-agri-green-mid hover:underline font-bold">Already have an account? Log in here</button>
                  </div>
                </>
              )}

              {authMode === 'phone_verify' && (
                <>
                  <h1 className="text-xl font-black text-gray-905 mb-2 text-center uppercase tracking-wide">Verify Mobile</h1>
                  <p className="text-[11px] text-gray-500 text-center mb-6 leading-normal">Please verify your phone number to complete signup.</p>
                  {!confirmationResult ? (
                    <form onSubmit={handleSendPhoneOTP} className="space-y-4">
                      <div>
                        <label className="text-[11px] font-bold text-gray-750 block mb-1">Full Name</label>
                        <input type="text" value={authName} onChange={e => setAuthName(e.target.value)} placeholder="e.g. Alok Patel" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-750 block mb-1">Indian State / Location</label>
                        <input type="text" value={authLocation} onChange={e => setAuthLocation(e.target.value)} placeholder="e.g. Maharashtra" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-750 block mb-1">Phone Number (with +91)</label>
                        <input type="tel" value={authPhone} onChange={e => setAuthPhone(e.target.value)} placeholder="+91 9876543210" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                      </div>
                      <button type="submit" className="w-full bg-[#2D5A3F] hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow">SEND OTP</button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOTP} className="space-y-4">
                      <div>
                        <label className="text-[11px] font-bold text-gray-750 block mb-1">Enter 6-digit OTP</label>
                        <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="123456" className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none" required />
                      </div>
                      <button type="submit" className="w-full bg-[#2D5A3F] hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow">VERIFY & CREATE ACCOUNT</button>
                    </form>
                  )}
                  <div className="mt-6 border-t pt-4 text-center">
                    <button onClick={() => setAuthMode('login')} className="text-[10px] text-gray-500 hover:underline">Cancel & Return to Login</button>
                  </div>
                </>
              )}

              {authMode === 'forgot_password' && (
                <>
                  <h1 className="text-xl font-black text-gray-905 mb-2 text-center uppercase tracking-wide">Recover Account</h1>
                  <p className="text-[11px] text-gray-500 text-center mb-6 leading-normal">Reset via Email link or Login directly via Mobile OTP.</p>

                  <div className="space-y-4">
                    <div className="p-3 border border-agri-cream-border rounded-xl bg-white space-y-2">
                      <label className="text-[11px] font-bold text-gray-750 block">Email Address</label>
                      <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" className="w-full border p-2 text-xs font-semibold rounded focus:outline-none" />
                      <button type="button" onClick={handleForgotPasswordEmail} className="w-full bg-[#2b3a30] text-white font-bold text-[10px] py-2 rounded">SEND RESET LINK</button>
                    </div>

                    <div className="text-center text-[10px] text-gray-400 font-bold">OR</div>

                    <div className="p-3 border border-agri-cream-border rounded-xl bg-white space-y-2">
                      {!confirmationResult ? (
                        <>
                          <label className="text-[11px] font-bold text-gray-750 block">Phone Number (with +91)</label>
                          <input type="tel" value={authPhone} onChange={e => setAuthPhone(e.target.value)} placeholder="+91 9876543210" className="w-full border p-2 text-xs font-semibold rounded focus:outline-none" />
                          <button type="button" onClick={handleSendPhoneOTP} className="w-full bg-[#2D5A3F] text-white font-bold text-[10px] py-2 rounded">SEND OTP TO LOGIN</button>
                        </>
                      ) : (
                        <form onSubmit={handleVerifyPhoneOTP}>
                          <label className="text-[11px] font-bold text-gray-750 block mb-1">Enter 6-digit OTP</label>
                          <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="123456" className="w-full border p-2 text-xs font-semibold rounded focus:outline-none mb-2" required />
                          <button type="submit" className="w-full bg-[#2b3a30] text-white font-bold text-[10px] py-2 rounded">VERIFY & LOGIN</button>
                        </form>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4 text-center">
                    <button onClick={() => setAuthMode('login')} className="text-[10px] text-gray-500 hover:underline">Back to Login</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 11.2: ADMIN DASHBOARD PLATFORM */}
        {routePath === '#admin' && (
          <div className="min-h-screen bg-[#F4F6F2] font-sans antialiased text-slate-800 flex flex-col md:flex-row animate-fade-in">
            {/* If not authenticated as Admin, show login screen */}
            {!adminUser ? (
              <div className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl max-w-md w-full text-center space-y-6">
                  <div>
                    <span className="inline-flex p-3 rounded-2xl bg-emerald-50 text-[#2D5A3F] mb-3">
                      <Leaf className="w-8 h-8 animate-pulse" />
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agriic Staff Hub</h2>
                    <p className="text-gray-500 text-xs mt-1">Science-led plant nutrition and grower support cockpit</p>
                  </div>

                  <form onSubmit={handleAdminEmailSignIn} className="space-y-4 text-left">
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1">Email address</label>
                      <input
                        type="email"
                        value="abhiirana2031@gmail.com"
                        readOnly
                        className="w-full border bg-gray-50 p-3 text-xs font-semibold rounded-xl focus:outline-none text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-750 block mb-1 font-mono">Password</label>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#2D5A3F] hover:bg-[#2c520c] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow"
                    >
                      LOGIN TO ADMIN HUB
                    </button>


                  </form>

                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Connecting to secure Cloud Firestore instance IDs: <br />
                    <strong className="font-mono text-slate-500">ai-studio-a19b472c-b3ef-4bd2-bee0-ad2edf9f388c</strong>
                  </p>
                </div>
              </div>
            ) : (
              /* Administrative Dashboard Main Shell */
              <div className="flex-1 flex flex-col md:flex-row min-h-screen">
                {/* Left Sidebar Layout */}
                <div className="w-full md:w-64 bg-[#1a1a1a] text-[#a3a3a3] shrink-0 flex flex-col border-r border-[#2d2d2d] relative z-20">
                  {/* Brand header */}
                  <div className="p-5 border-b border-[#2d2d2d] flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-[#333333] text-white">
                      <Store className="w-5 h-5" />
                    </span>
                    <div>
                      <h1 className="font-semibold text-sm text-white">My Store</h1>
                      <p className="text-[10px] text-gray-400">Admin Panel</p>
                    </div>
                  </div>

                  {/* Navigation Links: E-commerce Tabs */}
                  <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto max-h-[85vh]">
                    {[
                      { id: 'home', label: 'Home', icon: Globe },
                      { id: 'orders', label: 'Orders', icon: ShoppingBag },
                      { id: 'products', label: 'Products', icon: Package },
                      { id: 'customers', label: 'Customers', icon: User },
                      { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                      { id: 'marketing', label: 'Marketing', icon: Bell },
                      { id: 'discounts', label: 'Discounts', icon: Tag },
                      { id: 'settings', label: 'Settings', icon: ShieldCheck }
                    ].map((tab) => {
                      const IconComp = tab.icon;
                      const isActive = adminActiveTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setAdminActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive
                            ? 'bg-[#333333] text-white'
                            : 'text-[#a3a3a3] hover:bg-[#2d2d2d] hover:text-white'
                            }`}
                        >
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#a3a3a3]'}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer User Badge & Role switch */}
                  <div className="p-4 border-t border-[#2d2d2d] space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-xs uppercase">
                        {adminUser.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="text-xs block text-white truncate">{adminUser.name}</strong>
                        <span className="text-[10px] block text-gray-400">{adminUser.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleAdminSignOut}
                      className="w-full text-center py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white rounded-lg text-xs font-medium transition cursor-pointer mt-1"
                    >
                      Log out
                    </button>
                  </div>
                </div>

                {/* Right panel, main content */}
                <div className="flex-1 flex flex-col bg-[#f6f6f7] h-screen overflow-hidden">
                  {/* Top Navigation */}
                  <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                    <div className="flex-1 max-w-xl relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="Search orders, products, customers..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <button className="relative p-2 text-gray-400 hover:text-gray-600">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                      </button>
                      <button className="flex items-center gap-2 pl-4 border-l border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm uppercase">
                          {adminUser.name[0]}
                        </div>
                      </button>
                    </div>
                  </header>

                  <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
                    {/* System connection header */}
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between text-xs text-gray-500 shadow-sm mt-1 sm:mt-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Connected live to backend</span>
                      </div>
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded">
                        {adminUser.role}
                      </span>
                    </div>

                    {/* Modules Rendering router */}
                    {adminActiveTab === 'home' && (
                      <HomeModule
                        farmers={liveFarmers}
                        soilReports={liveSoilReports}
                        orders={liveOrders as any}
                        alertRules={liveAlertRules}
                        activities={liveActivities}
                        onClearActivities={handleClearActivities}
                        onNavigateToTab={(tabId) => setAdminActiveTab(tabId)}
                      />
                    )}

                    {adminActiveTab === 'customers' && (
                      <FarmersModule
                        farmers={liveFarmers}
                        onUpdateRole={handleUpdateFarmerRole}
                        onUpdateStatus={handleUpdateFarmerStatus}
                        onAddFarmer={async (farmer) => {
                          try {
                            const newId = `usr_${Date.now()}`;
                            await setDoc(doc(db, "users", newId), { id: newId, ...farmer });
                          } catch (e) {
                            handleLiveSyncError(e, 'create', 'users');
                          }
                        }}
                      />
                    )}

                    {adminActiveTab === 'products' && (
                      <ProductsModule
                        products={liveProducts as any}
                        orders={liveOrders as any}
                        onAddProduct={handleAddProductAdmin}
                        onEditProductStock={handleEditProductStock}
                        onDeleteProduct={handleDeleteProductAdmin}
                        onUpdateOrderStatus={handleUpdateOrderStatusAdmin}
                      />
                    )}

                    {adminActiveTab === 'analytics' && (
                      adminUser.role === 'Super Admin' ? (
                        <AnalyticsModule
                          orders={liveOrders as any}
                          farmers={liveFarmers}
                          soilReports={liveSoilReports}
                        />
                      ) : (
                        <div className="bg-white border rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto mt-10 shadow-sm animate-fade-in">
                          <span className="text-4xl block mb-4">🔒</span>
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Analytics Restricted</h3>
                          <p className="text-[10px] mt-1.5 leading-relaxed text-gray-500">Only users logged in with the <strong className="text-[#2D5A3F]">Super Admin</strong> privilege are autorun to query business and gross revenues. Please use the sidebar's role toggle to elevate privilege levels.</p>
                        </div>
                      )
                    )}

                    {adminActiveTab === 'marketing' && (
                      <ContentModule
                        contentItems={liveContent}
                        onAddContent={handlePublishArticle}
                        onDeleteContent={handleDeleteArticle}
                        onSendSegmentalPush={async (segment, subj, msg) => {
                          try {
                            const actId = `ACT_SMS_${Date.now()}`;
                            await setDoc(doc(db, "activities", actId), {
                              id: actId,
                              message: `⚡ SMS Broadcast: "${subj}" pushed to segment ${segment}`,
                              type: 'content',
                              time: 'just now'
                            });
                            showToastMsg(`SMS broadcast successfully scheduled to segment [${segment}]`);
                          } catch (e) {
                            handleLiveSyncError(e, 'create', 'activities');
                          }
                        }}
                      />
                    )}

                    {adminActiveTab === 'discounts' && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        <Tag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Discounts & Promotions</h3>
                        <p className="text-sm">Create and manage coupon codes and automatic discounts.</p>
                      </div>
                    )}

                    {adminActiveTab === 'orders' && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Order Management</h3>
                        <p className="text-sm">View, fulfill, and manage customer orders.</p>
                        <div className="mt-8 text-left max-w-4xl mx-auto bg-gray-50 rounded-lg p-4">
                          <p className="font-semibold text-gray-700 mb-4">Recent Orders ({liveOrders.length})</p>
                          {liveOrders.map(o => (
                            <div key={o.id} className="bg-white p-3 mb-2 rounded border border-gray-100 shadow-sm flex justify-between items-center text-sm">
                              <div><strong className="text-blue-600">{o.id}</strong> • {o.date}</div>
                              <div className="font-medium">₹{o.total.toFixed(2)}</div>
                              <div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{o.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {adminActiveTab === 'settings' && (
                      adminUser.role === 'Super Admin' ? (
                        <SettingsModule
                          farmers={liveFarmers}
                          products={liveProducts as any}
                          soilReports={liveSoilReports}
                          brandingTitle={liveSettings?.primaryBrandName || "Agriic Science HQ"}
                          onUpdateBranding={async (newTitle) => {
                            try {
                              const defaultSetts = {
                                primaryBrandName: newTitle,
                                primaryColor: "#2D5A3F",
                                secondaryColor: "#0F6E56",
                                enableSMS: true,
                                enablePayments: true,
                                enableWeather: true,
                                twoFactorEnabled: false
                              };
                              await setDoc(doc(db, "settings", "global_workspace"), defaultSetts);
                              showToastMsg(`Successfully updated settings branding title to: "${newTitle}"`);
                            } catch (e) {
                              handleLiveSyncError(e, 'write', 'settings/global_workspace');
                            }
                          }}
                        />
                      ) : (
                        <div className="bg-white border rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto mt-10 shadow-sm animate-fade-in">
                          <span className="text-4xl block mb-4">🔒</span>
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Workspace Settings Restricted</h3>
                          <p className="text-[10px] mt-1.5 leading-relaxed text-gray-500">Workspace settings and core system switches are restricted with ABAC permissions to <strong className="text-[#2D5A3F]">Super Admin</strong>. Elevate role below to view or manage setting profiles.</p>
                        </div>
                      )
                    )}
                  </main>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 11.5: PROFILE & ORDERS TRACKING */}
        {routePath === '#profile' && (
          <div className="py-12 px-4 md:px-8 lg:px-12 bg-white max-w-7xl mx-auto animate-fade-in text-slate-800">
            {/* Header info card */}
            <div className="bg-gradient-to-br from-[#2b3a30] to-[#1b251f] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-3.5 sm:gap-5 relative z-10 min-w-0 flex-1">
                {/* PROFILE AVATAR WITH PHOTO UPLOADER */}
                <div className="relative group shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 border-white/20 shadow-md object-cover transition-transform group-hover:scale-105 duration-200 bg-white"
                      alt="Grower Profile"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#D4A373] text-[#2D5A3F] flex items-center justify-center font-black text-xl sm:text-2.5xl border-4 border-white/20 shadow-md uppercase">
                      {(currentUser?.name || editName || 'Alok')[0]}
                    </div>
                  )}
                  {/* Small trigger Camera Badge */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -right-0.5 -bottom-0.5 w-5 h-5 sm:w-6.5 sm:h-6.5 rounded-full bg-[#2D5A3F] border-2 border-white text-[#D4A373] flex items-center justify-center hover:bg-[#D4A373] hover:text-[#2D5A3F] transition-colors shadow-md cursor-pointer text-[10px] sm:text-xs"
                    title="Change Profile Photo"
                    type="button"
                  >
                    <Camera className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white leading-tight break-words">
                      {currentUser?.name || editName || 'Alok Patel'}
                    </h1>
                    {!currentUser && (
                      <span className="bg-amber-500/20 text-amber-300 text-[8px] sm:text-[9.5px] uppercase font-black px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                        Demo Sandbox
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/70 mt-1 break-all max-w-full truncate" title={currentUser?.email || editEmail || 'alok.patel@agrimail.in'}>
                    {currentUser?.email || editEmail || 'alok.patel@agrimail.in'}
                  </p>
                  <div className="text-[9.5px] sm:text-[11px] text-white/95 font-medium mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#D4A373]" />
                      <span>State: <strong className="font-bold text-white">{currentUser?.location || editLocation || 'Maharashtra'}</strong></span>
                    </span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>Crop: <strong className="font-bold text-white">{currentUser?.cropType || editCropType || 'Vegetables & Herbs'}</strong></span>
                    </span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>Scale: <strong className="font-bold text-white">{currentUser?.landSize || editLandSize || 'Backyard (5-10 Pots)'}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                {!currentUser ? (
                  <a href="#auth" className="bg-[#D4A373] text-[#2D5A3F] text-xs font-black px-4.5 py-3 rounded-xl hover:bg-white transition-all shadow-md uppercase tracking-wider">
                    Sign in to Account
                  </a>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all"
                  >
                    Exit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Total Purchases</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">{orders.length}</span>
              </div>
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Active Deliveries</span>
                <span className="text-2xl font-extrabold text-amber-600 block mt-1">
                  {orders.filter(o => o.status !== 'Delivered').length}
                </span>
              </div>
              <div className="bg-[#D4A373]/10 border border-[#D4A373]/30 p-5 rounded-2xl">
                <span className="text-[10px] text-[#2b3a30] font-extrabold block uppercase tracking-wider">Arrived Safely</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">
                  {orders.filter(o => o.status === 'Delivered').length}
                </span>
              </div>
              <div className="bg-[#f7f6ee] border border-[#e2e1d7] p-5 rounded-2xl">
                <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">AgriPoints Balance</span>
                <span className="text-2xl font-extrabold text-[#2b3a30] block mt-1">
                  {orders.reduce((acc, curr) => acc + Math.floor(curr.total / 10), 0) + 180} pts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* EDITABLE FORM SIDEBAR */}
              <div className="lg:col-span-5 bg-[#fcfbf7] border border-[#e2e1d7] rounded-3xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center space-x-2.5 mb-5 border-b pb-4 border-[#e2e1d7]">
                  <div className="w-8 h-8 rounded-full bg-[#2D5A3F] flex items-center justify-center text-white shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#2D5A3F] tracking-tight">Grower Profile Settings</h3>
                    <p className="text-[10px] text-gray-400">Modify information metrics displayed in your agricultural logs.</p>
                  </div>
                </div>

                <form onSubmit={saveUserProfile} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Grower Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="e.g. Alok Patel"
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-agri-lime"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-agri-lime"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-agri-lime"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Indian State / Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={e => setEditLocation(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2D5A3F]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Crop focus</label>
                      <select
                        value={editCropType}
                        onChange={e => setEditCropType(e.target.value)}
                        className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none"
                      >
                        <option value="Vegetables & Herbs">Vegetables & Herbs</option>
                        <option value="Flowering & Roses">Flowering & Roses</option>
                        <option value="Organic Farm crops">Organic Farm crops</option>
                        <option value="Roof-Garden & Pots">Roof-Garden & Pots</option>
                        <option value="Fruit Orchards">Fruit Orchards</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black tracking-wider text-gray-500 uppercase block mb-1">Cultivation scale</label>
                      <select
                        value={editLandSize}
                        onChange={e => setEditLandSize(e.target.value)}
                        className="w-full border border-gray-200 bg-white p-3 text-xs font-semibold rounded-xl focus:outline-none"
                      >
                        <option value="Backyard (1-5 Pots)">Backyard (1-5 Pots)</option>
                        <option value="Terrace (5-20 Pots)">Terrace (5-20 Pots)</option>
                        <option value="Small Farm (0.5-2 Acres)">Small Farm (0.5-2 Acres)</option>
                        <option value="Medium (2-10 Acres)">Medium (2-10 Acres)</option>
                        <option value="Commercial Land">Commercial Land</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2D5A3F] hover:bg-black text-white hover:text-agri-lime font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider mt-2 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Save grower settings</span>
                  </button>
                </form>

                <div className="mt-5 bg-[#D4A373]/15 border border-[#D4A373]/30 rounded-2xl p-4 text-[10px] text-gray-600 leading-normal">
                  <span className="font-extrabold text-[#2D5A3F] block mb-1">🌱 Verified Diagnostics</span>
                  All mineral evaluations, diagnostic Soil Test™ logs, and temperature-controlled crop dispatch routes are protected under soil cybersecurity protocols.
                </div>
              </div>

              {/* ORDERS FEED LIST */}
              <div className="lg:col-span-7 space-y-6">
                {/* Orders Section Head */}
                <div className="border-b pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                      <Package className="w-5 h-5 text-[#2b3a30] shrink-0" />
                      <span>My Active & Historical Orders</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-normal">Real-time dynamic transit checkpoints for formulation dispatch logs.</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#D4A373] bg-[#2b3a30] px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Live Feed
                  </span>
                </div>

                {/* Orders Stack */}
                {orders.filter(o => o.farmerId === currentUser?.id).length === 0 ? (
                  <div className="text-center py-16 border rounded-3xl bg-slate-50 border-dashed">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Build your soil health list, add recipes to cart, and checkout to view active statuses here.</p>
                    <a href="#products" className="btn-primary inline-block mt-4 text-xs font-black uppercase">Browse Shop</a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.filter(o => o.farmerId === currentUser?.id).map((order) => {
                      return (
                        <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition duration-200">

                          {/* Top Order Row */}
                          <div className="bg-slate-50/80 px-4 sm:px-5 py-4 border-b border-gray-150 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">ID</span>
                                <span className="font-extrabold text-xs sm:text-sm text-slate-800">#{order.id}</span>
                              </div>
                              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Ordered On</span>
                                <span className="text-xs font-bold text-slate-700">{order.date}</span>
                              </div>
                              <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Invoice Amount</span>
                                <span className="text-xs font-extrabold text-slate-800 font-mono">₹{order.total}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                title="Simulate step transitions"
                                onClick={() => {
                                  const nextStatusMap: Record<string, 'Processing' | 'In-Transit' | 'Delivered'> = {
                                    'Processing': 'In-Transit',
                                    'In-Transit': 'Delivered',
                                    'Delivered': 'Processing'
                                  };
                                  const nextStatus = nextStatusMap[order.status];
                                  setOrders(orders.map(o => o.id === order.id ? { ...o, status: nextStatus } : o));
                                  showToastMsg(`Demo order status upgraded to: ${nextStatus}`);
                                }}
                                className="text-[10px] bg-white hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 transition shrink-0 flex items-center space-x-1 shadow-sm cursor-pointer"
                              >
                                <span>🔄 Upgrade Status</span>
                              </button>

                              <button
                                type="button"
                                title="Generate custom invoice template"
                                onClick={() => {
                                  setInvoiceModalOrder(order);
                                  setInvoiceEmailType('visual');
                                }}
                                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1.5 rounded-lg border border-emerald-200/50 transition shrink-0 flex items-center space-x-1 shadow-sm cursor-pointer"
                              >
                                <Mail className="w-3 h-3 text-emerald-800" />
                                <span>✉️ Send Invoice</span>
                              </button>

                              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 font-extrabold px-2.5 py-1.5 rounded-lg border border-red-200/50 transition shrink-0 flex items-center space-x-1 shadow-sm cursor-pointer"
                                >
                                  <XCircle className="w-3 h-3 text-red-700" />
                                  <span>Cancel Order</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="p-4 sm:p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                            {/* Status tracker steps */}
                            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-gray-150 pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-center">
                              <span className="text-[10px] font-bold text-gray-400 block mb-5 uppercase tracking-wider">Live Delivery Milestones</span>

                              {/* Steps tracker UI */}
                              {order.status === 'Cancelled' ? (
                                <div className="text-center py-6 px-4 bg-red-50 rounded-xl border border-red-100">
                                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                  <h4 className="text-red-800 font-bold text-sm">Order Cancelled</h4>
                                  <p className="text-red-600 text-xs mt-1">This order has been cancelled and will not be processed or delivered.</p>
                                </div>
                              ) : (
                                <>
                                  <div className="relative flex items-center justify-between w-full px-2 sm:px-4">

                                    {/* Connector bar background */}
                                    <div className="absolute top-4.5 left-6 sm:left-8 right-6 sm:right-8 h-1 bg-gray-200 -z-10 rounded-full" />

                                    {/* Connector bar active fill */}
                                    <div
                                      className="absolute top-4.5 left-6 sm:left-8 h-1 bg-[#2b3a30] -z-10 rounded-full transition-all duration-500"
                                      style={{
                                        width: order.status === 'Processing' ? '0%' : order.status === 'In-Transit' ? '50%' : '100%'
                                      }}
                                    />

                                    {/* Milestone 1 : Processing */}
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${order.status === 'Processing'
                                          ? 'bg-amber-50 border-amber-600 text-amber-700 font-bold ring-4 ring-amber-100 scale-105 shadow-md'
                                          : 'bg-[#2b3a30] border-[#2b3a30] text-[#D4A373]'
                                          }`}
                                      >
                                        <Clock className="w-4 h-4" />
                                      </div>
                                      <span className="text-[10px] sm:text-[11px] font-bold mt-2 text-center text-slate-800">Processing</span>
                                      <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">Scanned</span>
                                    </div>

                                    {/* Milestone 2 : In-Transit */}
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${order.status === 'In-Transit'
                                          ? 'bg-amber-50 border-amber-600 text-amber-700 ring-4 ring-amber-100 scale-105 shadow-md'
                                          : order.status === 'Delivered'
                                            ? 'bg-[#2b3a30] border-[#2b3a30] text-[#D4A373]'
                                            : 'bg-white border-gray-200 text-gray-350'
                                          }`}
                                      >
                                        <Truck className="w-4.5 h-4.5" />
                                      </div>
                                      <span className={`text-[10px] sm:text-[11px] font-bold mt-2 text-center ${order.status === 'Processing' ? 'text-gray-400' : 'text-slate-800'
                                        }`}>In Transit</span>
                                      <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">Underway</span>
                                    </div>

                                    {/* Milestone 3 : Delivered */}
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${order.status === 'Delivered'
                                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold ring-4 ring-emerald-100 scale-105 shadow-md'
                                          : 'bg-white border-gray-200 text-gray-350'
                                          }`}
                                      >
                                        <CheckCircle className="w-4.5 h-4.5" />
                                      </div>
                                      <span className={`text-[10px] sm:text-[11px] font-bold mt-2 text-center ${order.status !== 'Delivered' ? 'text-gray-400' : 'text-slate-800'
                                        }`}>Delivered</span>
                                      <span className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5">Arrived</span>
                                    </div>

                                  </div>
                                </>
                              )}

                              {/* Extra status report banner */}
                              {order.status !== 'Cancelled' && (
                                <div className="mt-8 bg-[#f7f6ee]/85 p-4 rounded-xl border border-gray-150 flex items-start space-x-3 text-xs leading-normal">
                                  <span className="text-base shrink-0 mt-0.5">
                                    {order.status === 'Processing' ? '⚙️' : order.status === 'In-Transit' ? '🚚' : '📦'}
                                  </span>
                                  <div>
                                    <p className="font-extrabold text-[#2D5A3F]">
                                      {order.status === 'Processing' && 'Formulation and raw-ingredient testing checks are active. Bagged and sealed.'}
                                      {order.status === 'In-Transit' && 'En-route past central transport corridors. Expected delivery in 32 Hours.'}
                                      {order.status === 'Delivered' && 'Checkpoints clear. Delivery verified successfully.'}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                      Ship destination: <strong className="text-gray-700 font-semibold">{order.address}</strong>
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Order item lists */}
                            <div className="lg:col-span-5 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold text-gray-400 block mb-3 uppercase tracking-wider">Formulation Breakdown</span>
                                <div className="space-y-3 max-h-68 overflow-y-auto pr-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-gray-150 rounded-xl p-3.5 space-y-2.5 transition hover:bg-slate-100/70">
                                      <div className="flex items-start space-x-3.5 min-w-0">
                                        <img src={item.img || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'} className="w-11 h-11 object-cover rounded-lg bg-white p-0.5 border shrink-0 shadow-sm" alt={item.name} />
                                        <div className="min-w-0 flex-1">
                                          <span className="text-xs font-black text-slate-800 block truncate leading-snug">{item.name}</span>
                                          <p className="text-[9px] text-gray-400 mt-0.5 font-mono">ID: {item.productId}</p>
                                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            <span className="bg-[#2D5A3F]/10 text-[#2D5A3F] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase font-sans">
                                              ₹{item.price}/bag
                                            </span>
                                            <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase font-sans">
                                              {item.qty} dispatch bags
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-xs font-extrabold text-slate-950 block font-mono">₹{item.price * item.qty}</span>
                                        </div>
                                      </div>

                                      {/* GROWER QUANTITY SUMMARY FOOTPRINT */}
                                      <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between text-[10px] text-gray-500 font-semibold gap-1">
                                        <span>⚖️ Total Batch dispatch mass:</span>
                                        <span className="text-slate-800 font-bold font-mono">
                                          {(item.qty * 1.5).toFixed(1)} Kg Formulation
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-5 pt-3.5 border-t border-gray-150/80 flex justify-between items-center text-xs">
                                <span className="capitalize font-bold text-slate-500">Method: {order.paymentMethod.toUpperCase()}</span>
                                <span className="text-[10px] text-gray-400 italic">Signature scan on record</span>
                              </div>
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick reference block */}
            <div className="mt-12 bg-[#2b3a30] text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#D4A373] uppercase tracking-wide">Need Delivery Interventions?</h4>
                <p className="text-xs text-white/70 leading-normal">Our organic dispatches are temperature-controlled. Contact regional helpline for reroutes.</p>
              </div>
              <a href="#contact" className="bg-[#D4A373] text-[#2D5A3F] hover:bg-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all whitespace-nowrap shadow-sm text-center">
                Contact Desk
              </a>
            </div>

          </div>
        )}

        {/* VIEW 12: PRIVACY POLICY */}
        {routePath === '#privacy' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto text-gray-700 leading-relaxed text-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="mb-4">Last Updated: June 17, 2026</p>
            <p className="mb-4">
              At Agriic Solutions Pvt. Ltd., we understand that information regarding crop coordinates, chemical soil composition ranges, and direct address identifiers are extremely private. We secure all diagnostic findings to guarantee soil baseline security.
            </p>
            <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Collected Metrics</h3>
            <p className="mb-4">
              We collect information provided explicitly by you—including crop variants, symptoms entered into the quiz module, address parameters, contact emails, and card transaction tokens processed securely via our bank gateways.
            </p>
          </div>
        )}

        {/* VIEW 13: TERMS */}
        {routePath === '#terms' && (
          <div className="py-12 px-4 md:px-12 bg-white max-w-4xl mx-auto text-gray-700 leading-relaxed text-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
            <p className="mb-4">Last Updated: June 17, 2026</p>
            <p className="mb-4">
              By accessing the Agriic website and taking the Soil Test™ diagnostic, you agree to be bound by standard state rules and the following guidelines.
            </p>
            <h3 className="font-bold text-gray-900 mt-6 mb-2">1. Formulation Intent & Claims</h3>
            <p className="mb-4">
              Our organic mixtures are created using carefully researched plant compounds. Outcomes depend significantly on moisture levels, regional seasonal changes, local insect pressures, and potting structure. If soil shows zero recovery, use the contact advisor panel to apply our Money-Back guidelines.
            </p>
          </div>
        )}

      </main>

      {/* -------------------------------------------------------
          WHY CHOOSE US & TRUST SECTION (GLOBAL)
      ------------------------------------------------------- */}
      <div className={`bg-white ${routePath === "#products" ? "hidden md:block" : ""}`}>
        <TrustSections />
      </div>

      {/* Persistent Footer */}
      <footer className={`bg-agri-dark text-white pt-10 pb-6 px-6 md:px-12 border-t border-[#bad15a]/10 relative z-30 ${routePath === '#products' ? 'hidden md:block' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">

          {/* Logo column */}
          <div className="space-y-3">
            <a href="#home" className="flex items-center inline-block">
              <img src="/logo2.jpeg" alt="Agriic Logo" className="h-12 w-auto object-contain rounded-md" />
            </a>
            <p className="text-[11px] text-white/70 leading-relaxed max-w-xs font-normal">
              Science-led, Ayurveda-inspired organic nutrition blends customized for Indian soils. Securing sustainable crop harvests since 2019.
            </p>
            <div className="flex space-x-3 text-white/55 text-[10px] font-semibold pt-1">
              <span>Mumbai</span>•<span>GUJARAT</span>•<span>VAPI</span>
            </div>
          </div>

          {/* Nav quick links */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-[#bad15a] uppercase">Explore</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-white/80">
              <a href="#home" className="hover:text-agri-lime transition">Home page</a>
              <a href="#products" className="hover:text-agri-lime transition">Product catalog</a>
              <a href="#science" className="hover:text-agri-lime transition">Scientific research</a>
              <a href="#soil-test" className="hover:text-agri-lime transition">Soil Test™ Quiz</a>
              <a href="#blog" className="hover:text-agri-lime transition">Growing Blog</a>
              <a href="#about" className="hover:text-agri-lime transition">Our journey</a>
            </div>
          </div>

          {/* Botanical support links */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-[#bad15a] uppercase">Support</h4>
            <div className="space-y-1.5 text-[11px] text-white/80">
              <a href="#contact" className="block hover:text-agri-lime transition">Direct Support request</a>
              <a href="https://wa.me/918047863601" target="_blank" rel="noopener" className="block hover:text-agri-lime transition">Chat on WhatsApp</a>
              <a href="#privacy" className="block hover:text-agri-lime transition">Privacy Policy</a>
              <a href="#terms" className="block hover:text-agri-lime transition">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-white/55 space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Agriic Solutions Private Limited. All mineral data secured.</p>
          <p className="text-white/70">
            Made by <a href="https://vexoritsolutions.site" target="_blank" rel="noopener noreferrer" className="text-agri-lime font-bold hover:underline tracking-wide hover:text-white transition-colors">VEXOR IT SOLUTIONS</a>
          </p>
          <p className="text-white/45">Unit 101, B Wing, Off Link Road, Malad West, Mumbai, MH - 400064</p>
        </div>
      </footer>

      {/* INVOICE MODAL SYSTEM */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 bg-[#1b261f]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="invoice-modal">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-150 flex flex-col my-8">
            {/* Modal Header */}
            <div className="bg-[#2b3a30] text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🧾</span>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-[#D4A373]">Grower Order Invoice Dispatch</h3>
                  <p className="text-[10px] text-white/70">Secure PDF Summary & Automation Template Panel</p>
                </div>
              </div>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white text-sm font-bold cursor-pointer"
                title="Dismiss View"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Inner Tabs navigation */}
            <div className="border-b border-gray-200 bg-slate-50 p-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setInvoiceEmailType('visual')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${invoiceEmailType === 'visual'
                  ? 'bg-white text-[#2D5A3F] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-slate-800'
                  }`}
              >
                🖼️ Beautiful Visual Preview
              </button>
              <button
                type="button"
                onClick={() => setInvoiceEmailType('code')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${invoiceEmailType === 'code'
                  ? 'bg-white text-[#2D5A3F] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-slate-800'
                  }`}
              >
                💻 Raw email HTML layout
              </button>
            </div>

            {/* Tab content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
              {invoiceEmailType === 'visual' ? (
                /* GORGEOUS DESIGN WITH DYNAMIC FIELDS */
                <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-inner relative space-y-6">
                  {/* Paid Watermark Banner */}
                  <div className="absolute right-6 top-6 border-4 border-emerald-600/30 text-emerald-600 text-[11px] font-black uppercase px-2.5 py-1 rounded-lg transform rotate-12 scale-105 select-none pointer-events-none">
                    🇮🇳 INVOICE PAID
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center shrink-0">
                        <img src="/logo2.jpeg" alt="Agriic Logo" className="h-8 w-auto object-contain rounded-md shadow-sm" />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">Science-Led Botanical Nutrition Solutions</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Invoice ID</span>
                      <span className="text-xs font-black text-slate-800 font-mono">#{invoiceModalOrder.id}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Metadata info */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Grower Details</span>
                      <strong className="text-slate-800 font-semibold block mt-0.5">{currentUser?.name || 'Registered Grower'}</strong>
                      <span className="text-gray-500 text-[10px] block mt-0.5">Phone: {currentUser?.phone || 'Not Specified'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Dispatch Details</span>
                      <span className="text-slate-800 font-semibold block mt-0.5">Ordered On: {invoiceModalOrder.date}</span>
                      <span className="text-gray-500 text-[10px] block mt-0.5">Method: {invoiceModalOrder.paymentMethod.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-[#f7f6ee]/70 p-3 rounded-xl border border-yellow-200/40 text-xs">
                    <span className="text-[9px] font-bold text-amber-900/60 uppercase block">Ship To Address</span>
                    <p className="text-slate-700 font-semibold mt-1">{invoiceModalOrder.address}</p>
                  </div>

                  {/* Line itemized breakdown table */}
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase mb-2 font-display">Formulation Items</span>
                    <div className="space-y-1.5">
                      {invoiceModalOrder.items.map((item, idy) => (
                        <div key={idy} className="flex justify-between items-center text-xs border-b border-gray-100 pb-1.5 pt-0.5">
                          <div>
                            <span className="font-extrabold text-slate-800 block">{item.name}</span>
                            <span className="text-[10px] text-gray-400">Qty: {item.qty} bag(s) • Weight: {(item.qty * 1.5).toFixed(1)} Kg</span>
                          </div>
                          <span className="font-mono font-bold text-slate-800">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fees footer summary */}
                  <div className="border-t border-gray-100 pt-3 flex flex-col items-end text-xs space-y-1.5 text-right font-display">
                    <div className="flex justify-between w-48 text-gray-500">
                      <span>Itemized Subtotal:</span>
                      <span className="font-mono">₹{invoiceModalOrder.total}</span>
                    </div>
                    <div className="flex justify-between w-48 text-[#2D5A3F] font-black text-sm border-t border-dashed border-gray-200 pt-1.5">
                      <span>Grand Total:</span>
                      <span className="font-mono text-slate-900">₹{invoiceModalOrder.total}</span>
                    </div>
                  </div>

                  {/* Digital signatures */}
                  <div className="border-t border-slate-100 pt-3 justify-between items-center flex text-[9px] text-gray-400">
                    <span>AGRIIC SECURE RECEIPT PROMPT</span>
                    <span className="italic font-mono">Authorized System stamp OK • 2026</span>
                  </div>
                </div>
              ) : (
                /* CODE GENERATOR SOURCE BLOCK FOR GROWERS WITH PRETTY COPY & DESCRIPTIONS */
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-blue-800 text-[11px] leading-normal font-sans">
                    💡 <strong>Grower system email template:</strong> This pristine responsive HTML template uses clean system styles and is pre-configured for dispatch via standard mail delivery agents.
                  </div>
                  <pre className="bg-slate-900 text-teal-400 p-4 rounded-xl text-[11px] font-mono overflow-auto max-h-72 select-all border border-slate-950/45">
                    {generateEmailTemplate(invoiceModalOrder)}
                  </pre>
                  <p className="text-[10px] text-gray-400 text-right">💡 Double click the raw input text container to select all HTML code fast.</p>
                </div>
              )}
            </div>

            {/* Action buttons footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-gray-150 flex flex-wrap justify-between items-center gap-3">
              {/* Copy action */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateEmailTemplate(invoiceModalOrder));
                  showToastMsg("Success! Professional HTML Invoice Code copied to clipboard!");
                }}
                className="bg-slate-250 text-slate-800 hover:bg-slate-350 text-[11px] font-black py-2 md:py-2.5 px-3.5 rounded-xl transition cursor-pointer"
              >
                📋 Copy HTML Source Code
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    showToastMsg("Simulated invoice print spooling initiated.");
                    window.print();
                  }}
                  className="bg-white hover:bg-slate-100 border border-gray-200 text-slate-800 text-[11px] font-extrabold py-2 md:py-2.5 px-3 rounded-xl transition cursor-pointer"
                >
                  🖨️ Print Dispatch Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToastMsg(`Email summary generated and successfully dispatched payload via simulated SMTP gateway to ${currentUser?.email || 'registered grower'}!`);
                    setInvoiceModalOrder(null);
                  }}
                  className="bg-[#2D5A3F] hover:bg-[#2b3a30] text-[#D4A373] text-[11px] font-black py-2 md:py-2.5 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1"
                >
                  <Mail className="w-3.5 h-3.5 mr-0.5 text-agri-lime" />
                  <span>📬 Dispatch via Simulated SMTP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══════════════════════════════════════════════════════
          GLOBAL SIDE-OUT MINI CART DRAWER
      ═══════════════════════════════════════════════════════ */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Panel */}
            <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl border-l border-gray-100 animate-slide-in">
              {/* Header */}
              <div className="px-5 py-6 bg-[#fbfbfa] border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    🛒 Shopping Cart <span className="bg-[#2D5A3F] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{getCartCount()}</span>
                  </h3>
                  <p className="text-[10px] text-slate-455 font-semibold uppercase tracking-wider mt-0.5">Your Selected Organic Nutrition</p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-650 transition-colors flex items-center justify-center font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 bg-[#e8f5ee] text-[#2D5A3F] rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800">Your cart is empty</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-[220px] font-semibold leading-relaxed">Add bio-nutrition solutions or seeds to start growing organic.</p>
                    <button
                      onClick={() => { setIsCartDrawerOpen(false); window.location.hash = '#products'; }}
                      className="mt-6 bg-[#2D5A3F] hover:bg-[#2d5a3d] text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow"
                    >
                      BROWSE CATALOG
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, idx) => {
                      const selectedSize = selectedSizes[item.product.id] || (item.product.sizes && item.product.sizes[0]) || 'Standard';
                      return (
                        <div key={idx} className="flex gap-4 p-3 bg-[#fbfbfa] rounded-2xl border border-gray-100">
                          {/* Image */}
                          <div className="w-20 h-20 bg-slate-50 border border-gray-100 rounded-xl p-1.5 flex items-center justify-center shrink-0">
                            <img src={item.product.img} className="max-h-full object-contain mix-blend-multiply" alt={item.product.name} />
                          </div>

                          {/* Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-800 leading-tight line-clamp-2">{item.product.name}</h4>
                              <p className="text-[9px] font-bold text-[#2D5A3F] uppercase tracking-wider mt-0.5">{item.product.category}</p>
                              <span className="text-[10px] text-slate-450 font-bold bg-white px-2 py-0.5 rounded border border-gray-100 w-max block mt-1">{selectedSize}</span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              {/* Price */}
                              {(() => {
                                const displayOriginalPrice = item.product.originalPrice || Math.round(item.product.price / 0.9);
                                return (
                                  <div>
                                    <span className="font-black text-slate-900 text-sm">₹{item.product.price * item.qty}</span>
                                    <span className="text-[10px] text-gray-400 line-through ml-1.5 font-semibold">₹{displayOriginalPrice * item.qty}</span>
                                  </div>
                                );
                              })()}

                              {/* Stepper */}
                              <div className="flex items-center bg-[#2D5A3F] text-white rounded-lg overflow-hidden h-[26px] border border-[#2D5A3F]">
                                <button onClick={() => updateCartQty(item.product.id, item.qty - 1)} className="px-2 h-full flex items-center justify-center hover:bg-[#2d5a3d] transition-colors"><Minus className="w-2.5 h-2.5" /></button>
                                <span className="px-1.5 text-center font-black text-xs min-w-[16px]">{item.qty}</span>
                                <button onClick={() => updateCartQty(item.product.id, item.qty + 1)} className="px-2 h-full flex items-center justify-center hover:bg-[#2d5a3d] transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cart.length > 0 && (
                <div className="border-t border-gray-150 p-5 bg-[#fbfbfa]">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-bold text-slate-550">
                      <span>Items Subtotal</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                    {(() => {
                      const totalOriginal = cart.reduce((acc, curr) => acc + (curr.product.originalPrice || curr.product.price) * curr.qty, 0);
                      const savings = totalOriginal - getSubtotal();
                      if (savings > 0) {
                        return (
                          <div className="flex justify-between text-xs font-black text-emerald-600">
                            <span>Your Total Savings</span>
                            <span>- ₹{savings}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-gray-100 pt-2">
                      <span>Grand Total</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-6">
                    <a
                      href="#checkout"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full bg-[#2D5A3F] hover:bg-[#2d5a3d] text-white font-black py-4.5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xs tracking-wider uppercase text-center block"
                    >
                      PROCEED TO CHECKOUT ⚡
                    </a>
                    <a
                      href="#cart"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full bg-white hover:bg-slate-50 text-[#2D5A3F] border-2 border-[#2D5A3F]/20 font-black py-3.5 rounded-2xl transition-colors text-xs tracking-wider uppercase text-center block"
                    >
                      View Detailed Cart
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
