"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  Archive,
  ArchiveX,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Landmark,
  Cpu,
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  MessageSquare,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ContactCard } from "@/components/leads/contact-card";
import { SignalItem } from "@/components/leads/signal-item";
import { EmailPreview } from "@/components/leads/email-preview";
import { ThreatSurface } from "@/components/leads/threat-surface";
import { useLeadActions } from "@/hooks/use-lead-actions";

function fitScoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-red-500/10 text-red-600 border-red-500/20";
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) throw new Error("Failed to fetch lead");
      return res.json();
    },
    enabled: !!id,
  });

  const actions = useLeadActions(id, lead?.company || "");
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "overview";

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Lead not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-6xl space-y-6 p-4 md:p-6"
    >
      {/* Back link */}
      <Link
        href="/leads"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to leads
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{lead.company}</h1>
          <Badge variant="secondary">{lead.industry}</Badge>
          <Badge variant="outline" className={fitScoreColor(lead.fitScore)}>
            Fit: {lead.fitScore}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5" onClick={actions.goToEmails}>
            <Mail className="h-3.5 w-3.5" />
            Email
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => actions.snooze(1)}>
            <Clock className="h-3.5 w-3.5" />
            Snooze
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => actions.archive()}>
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threat-surface">Threat Surface</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="space-y-6 pt-4">
            {/* Firmographics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FirmographicCard icon={MapPin} label="Headquarters" value={lead.hq} />
              <FirmographicCard icon={Users} label="Employees" value={lead.employees?.toLocaleString()} />
              <FirmographicCard icon={DollarSign} label="Revenue" value={lead.revenueBand} />
              <FirmographicCard icon={Landmark} label="Funding" value={lead.funding} />
              <FirmographicCard icon={Globe} label="Domain" value={lead.domain} />
              <FirmographicCard icon={Activity} label="Status" value={lead.status} />
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {lead.techStack?.map((tech: string) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Threat Surface */}
        <TabsContent value="threat-surface">
          <div className="pt-4">
            <ThreatSurface
              techStack={lead.techStack || []}
              signals={lead.signals || []}
            />
          </div>
        </TabsContent>

        {/* People */}
        <TabsContent value="people">
          <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
            {lead.contacts?.map((contact: any) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
            {(!lead.contacts || lead.contacts.length === 0) && (
              <p className="text-sm text-muted-foreground">No contacts found.</p>
            )}
          </div>
        </TabsContent>

        {/* Signals */}
        <TabsContent value="signals">
          <div className="space-y-3 pt-4">
            {lead.signals
              ?.sort(
                (a: any, b: any) =>
                  new Date(b.capturedAt).getTime() -
                  new Date(a.capturedAt).getTime()
              )
              .map((signal: any) => (
                <SignalItem key={signal.id} signal={signal} />
              ))}
            {(!lead.signals || lead.signals.length === 0) && (
              <p className="text-sm text-muted-foreground">No signals yet.</p>
            )}
          </div>
        </TabsContent>

        {/* Emails */}
        <TabsContent value="emails">
          <div className="pt-4">
            <Tabs defaultValue="cold_intro">
              <TabsList>
                <TabsTrigger value="cold_intro">Cold Intro</TabsTrigger>
                <TabsTrigger value="threat_anchored">Threat-Anchored</TabsTrigger>
                <TabsTrigger value="executive_brief">Executive Brief</TabsTrigger>
              </TabsList>

              {["cold_intro", "threat_anchored", "executive_brief"].map(
                (variant) => (
                  <TabsContent key={variant} value={variant}>
                    <div className="space-y-4 pt-4">
                      {lead.emails
                        ?.filter((e: any) => e.variant === variant)
                        .map((email: any) => (
                          <EmailPreview key={email.id} email={email} leadId={id} />
                        ))}
                      {(!lead.emails ||
                        lead.emails.filter((e: any) => e.variant === variant)
                          .length === 0) && (
                        <p className="text-sm text-muted-foreground">
                          No {variant.replace("_", " ")} drafts available.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity">
          <div className="space-y-4 pt-4">
            {lead.activities && lead.activities.length > 0 ? (
              <div className="relative space-y-4">
                {lead.activities
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((activity: any) => {
                    const iconMap: Record<string, any> = {
                      snoozed: Clock,
                      archived: Archive,
                      unarchived: ArchiveX,
                      email_sent: Mail,
                      email_regenerated: Zap,
                      pipeline_moved: ArrowRight,
                      viewed: Eye,
                      note: MessageSquare,
                    };
                    const IconComponent = iconMap[activity.kind] || Activity;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 rounded-md border p-3"
                      >
                        <div className="rounded-md bg-muted p-2">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium capitalize">
                            {activity.kind.replace(/_/g, " ")}
                          </p>
                          {activity.payload &&
                            Object.keys(activity.payload).length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {Object.entries(activity.payload)
                                  .map(
                                    ([key, val]) =>
                                      `${key}: ${val}`
                                  )
                                  .join(" · ")}
                              </p>
                            )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function FirmographicCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3 px-4 py-3">
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-sm font-medium">{value || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
