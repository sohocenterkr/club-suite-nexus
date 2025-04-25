
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">FacilityHub</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              쉽고 편리한 회원 관리 시스템으로 당신의 비즈니스를 성장시키세요.
              헬스장, 수영장, 스터디룸 등 다양한 시설에서 사용할 수 있습니다.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider">솔루션</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  헬스장 관리
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  수영장 관리
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  스터디룸 관리
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  기타 시설 관리
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider">서포트</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  고객 지원
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  문서
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  연락처
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider">회사</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  소개
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  블로그
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  채용
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-sm text-center text-muted-foreground">
            © {new Date().getFullYear()} FacilityHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
