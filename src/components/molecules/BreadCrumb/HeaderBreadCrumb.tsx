import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/atoms/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mappingBreadcrumbs } from "@utils/list";

export default function HeaderBreadCrumb() {
  const pathname = usePathname();

  // Check if current path has sub-pages (e.g., /job-list/id or /job-list/menu)
  const pathSegments = pathname.split("/").filter(Boolean);
  const hasSubPage = pathSegments.length > 1;

  // Get breadcrumbs for current route
  const baseRoute = pathSegments[0]; // e.g., "job-list"
  const breadcrumbs =
    mappingBreadcrumbs[baseRoute as keyof typeof mappingBreadcrumbs] || [];

  return (
    <div>
      {hasSubPage ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <div key={index} className="flex items-center gap-2.5">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-font-primary bg-border-secondary border-border-accent rounded-md border px-4 py-1 text-sm font-bold">
                        {crumb.tittle}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={crumb.link}
                          className="text-font-primary rounded-md border px-4 py-1 text-sm font-bold shadow-sm"
                        >
                          {crumb.tittle}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="text-font-primary [&>svg]:h-6 [&>svg]:w-6" />
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <Link href="/">
          {/* <RakaminLogo /> */}
          <h1 className="text-lg font-bold">{breadcrumbs[0]?.tittle}</h1>
        </Link>
      )}
    </div>
  );
}
