// export const BASE_URL = 'https://university-red.vercel.app'; 
export const BASE_URL =
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === 'development'
    ? 'http://localhost:7000'
    : '';
export const USERS_URL = '/api/users';
export const DEPARTMENTS_URL = '/api/departments';
export const  CATEGORIES_URL = '/api/categories';
export const  ROLES_URL = '/api/roles';
export const  IDEAS_URL = '/api/ideas';
export const STATISTICS_URL = '/api/reports';
export const  FILE_DOWNLOAD_URL = '/api/download';
export const CLOUSER_DATE_URL = '/api/closuredates';
export const IDEA_REPORT_URL = '/api/ideareports';



