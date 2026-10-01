import { Link } from "react-router";

import { BrandMark } from "@/components/site/BrandMark";
import { useI18n } from "@/lib/i18n";
import { SUBJECTS } from "@/lib/subjects";

export function SiteFooter() {
  const { t, subjectName } = useI18n();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <BrandMark className="size-8 text-primary" />
            <span className="text-base font-bold tracking-tight">NovaTools</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {t("footer.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              {t("footer.subjects")}
            </p>
            <ul className="mt-4 space-y-4">
              {SUBJECTS.map((subject) => (
                <li key={subject.id}>
                  <Link
                    to={subject.slug}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {subjectName(subject.id, subject.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              {t("footer.toolkit")}
            </p>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/maths"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {t("footer.startRevising")}
                </Link>
              </li>
              <li>
                <Link
                  to="/#principles"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {t("footer.howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  to="/#roadmap"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {t("footer.roadmap")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-label font-semibold tracking-wide text-muted-foreground uppercase">
              {t("footer.account")}
            </p>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/auth"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {t("common.signIn")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {t("common.dashboard")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-label text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="max-w-xl sm:text-right">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
