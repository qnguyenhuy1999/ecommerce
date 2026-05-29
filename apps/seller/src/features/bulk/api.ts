import {
  createBulkExport,
  createBulkImport,
  getBulkJobs as getBulkJobsBase,
} from '../integration/seller-page-api'

export async function getBulkJobs(limit?: number) {
  const jobs = await getBulkJobsBase(limit)
  return jobs.items
}

export { createBulkExport, createBulkImport }
