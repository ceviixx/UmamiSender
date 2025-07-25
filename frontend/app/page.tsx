'use client'

import { useI18n } from "@/locales/I18nContext";
import React, { useEffect, useState } from 'react'
import { fetchDashboardStats } from '@/lib/api'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

import { fetchJobChartData } from '@/lib/api'
import JobChart from '@/components/JobChart';

import { 
  BriefcaseIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  PuzzlePieceIcon
} from '@heroicons/react/20/solid'

export default function Dashboard() {
  const [stats, setStats] = useState<null | {
    senders: number;
    umami: number;
    jobs: number;
    webhooks: number;
  }>(null);
  const [logStats, setLogStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { locale } = useI18n()

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false))
    
    fetchJobChartData()
      .then(setLogStats)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title={locale.pages.dashboard}
      />

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-6">
        <DashboardTile loading={loading} label={locale.pages.umami} value={stats?.umami} icon={<ChartBarIcon className="text-blue-400 w-12 h-12" />} dest='umami-config' />
        <DashboardTile loading={loading} label={locale.pages.jobs} value={stats?.jobs} icon={<BriefcaseIcon className="text-blue-400 w-12 h-12" />} dest='jobs' />
        <DashboardTile loading={loading} label={locale.pages.sender} value={stats?.senders} icon={<PaperAirplaneIcon className="text-blue-400 w-12 h-12" />} dest='senders' />
        <DashboardTile loading={loading} label={locale.pages.webhook} value={stats?.webhooks} icon={<PuzzlePieceIcon className="text-blue-400 w-12 h-12" />} dest='webhooks' />
      </div>

      <div className="pt-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <JobChart jobData={logStats} />
        </div>
      </div>
      
    </div>
  )
}

function DashboardTile({ loading, label, value, icon, dest }: { loading: boolean; label: string; value?: number; icon: any; dest: string; }) {
  return (
    <Link href={dest}>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          {icon}
          <span className="text-4xl font-bold text-primary-700">
            {loading ? (<p>-</p>) : value}
          </span>
        </div>
        <div className="mt-auto text-gray-600 text-sm font-bold">{label}</div>
      </div>
    </Link>
  )
}