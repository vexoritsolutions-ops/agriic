import fs from 'fs';

const filePath = './src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
content = content.replace(
  /import \{ PRODUCTS, BLOG_POSTS, TESTIMONIALS, INGREDIENTS, GOOGLE_REVIEWS, EXPECTATIONS_LIST, QUIZ_QUESTIONS, Product, MOCK_ORDERS, Order \} from '\.\/data';/g,
  `import { Product, Order, BlogPost, Testimonial, Ingredient, GoogleReview, Expectation, QuizQuestion } from './types';`
);

// 2. Add state variables
const stateHooksInjection = `
  const [liveBlogPosts, setLiveBlogPosts] = useState<BlogPost[]>([]);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);
  const [liveIngredients, setLiveIngredients] = useState<Ingredient[]>([]);
  const [liveGoogleReviews, setLiveGoogleReviews] = useState<GoogleReview[]>([]);
  const [liveExpectations, setLiveExpectations] = useState<Expectation[]>([]);
  const [liveQuizQuestions, setLiveQuizQuestions] = useState<QuizQuestion[]>([]);
`;

content = content.replace(
  /const \[liveSettings, setLiveSettings\] = useState<WorkspaceSettings \| null>\(null\);/g,
  `const [liveSettings, setLiveSettings] = useState<WorkspaceSettings | null>(null);${stateHooksInjection}`
);

// 3. Add listeners
const listenerHooksInjection = `
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
`;

content = content.replace(
  /const u11 = onSnapshot\(doc\(db, "settings", "global_workspace"\), \(doc\) => \{[\s\S]*?\}, \(err\) => handleLiveSyncError\(err, 'get', 'settings\/global_workspace'\)\);/g,
  `const u11 = onSnapshot(doc(db, "settings", "global_workspace"), (doc) => {
      if (doc.exists()) {
        setLiveSettings(doc.data() as WorkspaceSettings);
      }
    }, (err) => handleLiveSyncError(err, 'get', 'settings/global_workspace'));${listenerHooksInjection}`
);

content = content.replace(
  /if \(typeof u11 === 'function'\) u11\(\);/g,
  `if (typeof u11 === 'function') u11();
      if (typeof u12 === 'function') u12();
      if (typeof u13 === 'function') u13();
      if (typeof u14 === 'function') u14();
      if (typeof u15 === 'function') u15();
      if (typeof u16 === 'function') u16();
      if (typeof u17 === 'function') u17();`
);

// 4. Replace hardcoded references
content = content.replace(/\bPRODUCTS\b/g, 'liveProducts');
content = content.replace(/\bMOCK_ORDERS\b/g, 'liveOrders');
content = content.replace(/\bBLOG_POSTS\b/g, 'liveBlogPosts');
content = content.replace(/\bTESTIMONIALS\b/g, 'liveTestimonials');
content = content.replace(/\bINGREDIENTS\b/g, 'liveIngredients');
content = content.replace(/\bGOOGLE_REVIEWS\b/g, 'liveGoogleReviews');
content = content.replace(/\bEXPECTATIONS_LIST\b/g, 'liveExpectations');
content = content.replace(/\bQUIZ_QUESTIONS\b/g, 'liveQuizQuestions');

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.tsx refactoring completed successfully.');
