import {
  createBulkExport,
  createBulkImport,
  getBulkJobs as getBulkJobsBase,
} from '../integration/seller-page-api'

export async function getBulkJobs(limit?: number, init?: RequestInit) {
  const jobs = await getBulkJobsBase(limit, init)
  return jobs.items
}

export { createBulkExport, createBulkImport }
