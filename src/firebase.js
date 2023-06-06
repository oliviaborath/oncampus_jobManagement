import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCG_t9GE3yHUcbb0c59mRU6cGZISJwRCVQ',
//   authDomain: 'scholarship-student-5e426.firebaseapp.com',
//   projectId: 'scholarship-student-5e426',
//   storageBucket: 'scholarship-student-5e426.appspot.com',
//   messagingSenderId: '877399195436',
//   appId: '1:877399195436:web:9441720ddca0d9b17ab689',
//   measurementId: 'G-EPPF6SCQKM',
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAM2IPTEMYu7OIkAw_QFQ2tPfpjDr_Kl2k',
  authDomain: 'api-playground-f9625.firebaseapp.com',
  databaseURL:
    'https://api-playground-f9625-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'api-playground-f9625',
  storageBucket: 'api-playground-f9625.appspot.com',
  messagingSenderId: '320115827584',
  appId: '1:320115827584:web:d9604203408cfeea94d765',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (email, password) => {
  try {
    createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const addStudent = async (data) => {
  console.log('add student');
  await addDoc(collection(db, 'students'), data);
};

const addStaff = async (data) => {
  console.log('add staff');
  await addDoc(collection(db, 'staffs'), data);
};

const addJob = async (data) => {
  console.log('add job');
  data.timestamp = serverTimestamp();
  await addDoc(collection(db, 'jobs'), data);
};

const addApplication = async (data) => {
  console.log('add application');
  data.timestamp = serverTimestamp();
  await addDoc(collection(db, 'applications'), data);
};

const getStudents = async () => {
  console.log('get students');
  const docQuery = query(collection(db, 'students'));
  const docs = await getDocs(docQuery);
  const students = [];
  docs.forEach((element) => {
    const student = element.data();
    student.uid = element.id;
    students.push(student);
  });

  return students;
};

const getStaffs = async () => {
  console.log('get staffs');
  const docQuery = query(collection(db, 'staffs'));
  const docs = await getDocs(docQuery);
  const staffs = [];
  docs.forEach((element) => {
    const staff = element.data();
    staff.uid = element.id;
    staffs.push(staff);
  });

  return staffs;
};

const getJobs = async () => {
  console.log('get jobs');
  const docQuery = query(collection(db, 'jobs'));
  const docs = await getDocs(docQuery);
  const jobs = [];
  docs.forEach((element) => {
    const job = element.data();
    job.id = element.id;
    jobs.push(job);
  });

  return jobs;
};

const getJobsByOwner = async (email) => {
  console.log('get jobs by owner');
  const docQuery = query(
    collection(db, 'jobs'),
    where('jobOwner', '==', email),
    orderBy('timestamp', 'desc')
  );
  const docs = await getDocs(docQuery);
  const jobs = [];
  docs.forEach((element) => {
    const job = element.data();
    job.id = element.id;
    jobs.push(job);
  });

  return jobs;
};

const getJob = async (id) => {
  console.log('get job');
  const docRef = doc(db, 'jobs', id);
  const result = await getDoc(docRef);
  const job = result.data();
  job.id = result.id;

  return job;
};

const getApplicationsByJobId = async (id) => {
  console.log('get application by job id');
  const docQuery = query(
    collection(db, 'applications'),
    where('job.id', '==', id),
    orderBy('timestamp', 'asc')
  );
  const docs = await getDocs(docQuery);
  const applications = [];
  docs.forEach((element) => {
    const application = element.data();
    application.id = element.id;
    applications.push(application);
  });
  return applications;
};

const getApplicationsByJobEmail = async (email) => {
  console.log('get application by job email');
  const docQuery = query(
    collection(db, 'applications'),
    where('email', '==', email),
    orderBy('timestamp', 'desc')
  );
  const docs = await getDocs(docQuery);
  const applications = [];
  docs.forEach((element) => {
    const application = element.data();
    application.id = element.id;
    applications.push(application);
  });
  return applications;
};

const getApplicationsByJobOwner = async (email) => {
  console.log('get application by job owner');
  const docQuery = query(
    collection(db, 'applications'),
    where('job.jobOwner', '==', email),
    orderBy('timestamp', 'desc')
  );
  const docs = await getDocs(docQuery);
  const applications = [];
  docs.forEach((element) => {
    const application = element.data();
    application.id = element.id;
    applications.push(application);
  });
  return applications;
};

const getApplication = async (id) => {
  console.log('get application');
  const docRef = doc(db, 'applications', id);
  const result = await getDoc(docRef);
  const application = result.data();
  application.studentId = application.id;
  application.id = result.id;

  return application;
};

const getStudentCourses = async (email) => {
  console.log('get student courses');
  let docQuery = query(collection(db, 'students'), where('email', '==', email));
  let docs = await getDocs(docQuery);
  const data = docs.docs[0].data();
  return data.courses;
};

const getStudent = async (email) => {
  console.log('get student');
  let docQuery = query(collection(db, 'students'), where('email', '==', email));
  let docs = await getDocs(docQuery);
  const data = docs.docs[0].data();
  return data;
};

const getUserData = async (role, email) => {
  console.log('get user data');
  let docQuery, docs;
  if (role === 'student') {
    docQuery = query(collection(db, 'students'), where('email', '==', email));
    docs = await getDocs(docQuery);
  } else if (role === 'staff') {
    docQuery = query(collection(db, 'staffs'), where('email', '==', email));
    docs = await getDocs(docQuery);
  }
  const data = docs.docs[0].data();
  return data;
};

const getUserRole = async (email) => {
  console.log('get user role');
  let docQuery = query(collection(db, 'students'), where('email', '==', email));
  let docs = await getDocs(docQuery);
  if (docs.docs.length === 0) {
    docQuery = query(collection(db, 'staffs'), where('email', '==', email));
    docs = await getDocs(docQuery);
  }
  const data = docs.docs[0].data();
  return data.role;
};

const updateStudent = async (email, data) => {
  console.log('update student');
  try {
    const docQuery = query(
      collection(db, 'students'),
      where('email', '==', email)
    );
    const docs = await getDocs(docQuery);
    await updateDoc(docs.docs[0].ref, data);
  } catch (error) {
    console.error(error);
  }
};

const updateStaff = async (email, data) => {
  console.log('update staff');
  try {
    const docQuery = query(
      collection(db, 'staffs'),
      where('email', '==', email)
    );
    const docs = await getDocs(docQuery);
    await updateDoc(docs.docs[0].ref, data);
  } catch (error) {
    console.error(error);
  }
};

const updateApplication = async (id, data) => {
  console.log('update application');
  try {
    const docRef = doc(db, 'applications', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(error);
  }
};

const updateJob = async (id, data) => {
  console.log('update job');
  try {
    const docRef = doc(db, 'jobs', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(error);
  }
};

const deleteJob = async (id) => {
  try {
    await deleteDoc(doc(db, 'jobs', id));
  } catch (error) {
    console.error(error);
  }
};

const deleteStudent = async (id) => {
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (error) {
    console.error(error);
  }
};

const deleteStaff = async (id) => {
  try {
    await deleteDoc(doc(db, 'staffs', id));
  } catch (error) {
    console.error(error);
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  addStudent,
  addStaff,
  addJob,
  addApplication,
  getStudents,
  getStaffs,
  getJobs,
  getJobsByOwner,
  getJob,
  getApplicationsByJobId,
  getApplicationsByJobEmail,
  getApplicationsByJobOwner,
  getApplication,
  getStudentCourses,
  getStudent,
  getUserData,
  getUserRole,
  updateApplication,
  updateJob,
  updateStudent,
  updateStaff,
  deleteJob,
  deleteStudent,
  deleteStaff,
};
