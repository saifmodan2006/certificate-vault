export type SocialLinks = {
  linkedin: string;
  github: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  skills: string[];
  profile_image: string;
  social_links: SocialLinks;
  has_portfolio_password: boolean;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string;
  credential_url: string;
  category: string;
  file_name: string;
  file_url: string;
  visibility: "public" | "private";
  created_at: string | null;
};

export type PublicProfile = {
  name: string;
  username: string;
  bio: string;
  skills: string[];
  profile_image: string;
  social_links: SocialLinks;
};

export type PublicPortfolio = {
  profile: PublicProfile;
  certificates: Certificate[];
};
