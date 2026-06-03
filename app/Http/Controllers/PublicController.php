<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApplicationRequest;
use App\Http\Requests\ContactMessageRequest;
use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\ContactMessage;
use App\Models\Job;
use App\Models\Location;
use App\Models\SavedJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $liveData = $this->homepageLiveData();
        $canonicalUrl = $this->absoluteUrl(route('home', [], false));
        $description = 'Find verified jobs, trusted companies, and career opportunities in Afghanistan with Galaxy Jobs.';

        return Inertia::render('public/home', [
            ...$liveData,
            'featuredJobs' => $liveData['featured_jobs'],
            'topCompanies' => $liveData['featured_companies'],
            'latestJobs' => $liveData['featured_jobs'],
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
            'seo' => [
                'title' => 'Galaxy Jobs - Find verified jobs in Afghanistan',
                'description' => $description,
                'keywords' => 'jobs in Afghanistan, Kabul jobs, remote jobs, hiring, careers, employers',
                'canonical' => $canonicalUrl,
                'image' => $this->absoluteUrl('/apple-touch-icon.png'),
                'type' => 'website',
                'robots' => 'index, follow',
                'jsonLd' => $this->homepageJsonLd($canonicalUrl, $description, $liveData['featured_jobs']->take(3)),
            ],
            'liveUrl' => route('homepage.live', [], false),
        ]);
    }

    public function live()
    {
        return response()->json($this->homepageLiveData());
    }

    public function about()
    {
        $canonicalUrl = $this->absoluteUrl(route('about', [], false));
        $description = 'Learn about Galaxy Jobs, a recruitment and career platform developed and operated by Galaxy Technology.';

        return Inertia::render('public/about', [
            'stats' => [
                'jobs' => Job::public()->count(),
                'companies' => Company::where('verification_status', 'approved')->where('is_active', true)->count(),
                'candidates' => User::where('role', 'employee')->where('status', 'active')->count(),
                'applications' => Application::count(),
            ],
            'seo' => $this->pageSeo(
                'About Galaxy Jobs - Powered by Galaxy Technology',
                $description,
                $canonicalUrl,
                [
                    [
                        '@context' => 'https://schema.org',
                        '@type' => 'AboutPage',
                        'name' => 'About Galaxy Jobs',
                        'url' => $canonicalUrl,
                        'description' => $description,
                        'publisher' => ['@id' => $this->absoluteUrl('/#organization')],
                    ],
                    $this->organizationJsonLd(),
                ],
            ),
        ]);
    }

    public function contact()
    {
        $canonicalUrl = $this->absoluteUrl(route('contact', [], false));
        $description = 'Contact Galaxy Jobs and Galaxy Technology for recruitment, employer, and platform support.';

        return Inertia::render('public/contact', [
            'contactInfo' => $this->contactInfo(),
            'seo' => $this->pageSeo(
                'Contact Galaxy Jobs - Galaxy Technology',
                $description,
                $canonicalUrl,
                [
                    [
                        '@context' => 'https://schema.org',
                        '@type' => 'ContactPage',
                        'name' => 'Contact Galaxy Jobs',
                        'url' => $canonicalUrl,
                        'description' => $description,
                        'publisher' => ['@id' => $this->absoluteUrl('/#organization')],
                    ],
                    $this->organizationJsonLd(),
                ],
            ),
        ]);
    }

    public function storeContact(ContactMessageRequest $request)
    {
        $message = ContactMessage::create($request->validated());

        try {
            Mail::raw(
                "New contact message from {$message->name}\n\nEmail: {$message->email}\nPhone: {$message->phone}\nSubject: {$message->subject}\n\n{$message->message}",
                fn ($mail) => $mail
                    ->to($this->contactInfo()['email'])
                    ->subject('New Galaxy Jobs contact message: '.$message->subject)
            );
        } catch (\Throwable) {
            report('Contact message saved, but email notification could not be sent.');
        }

        return back()->with('success', 'Thank you. Your message has been received.');
    }

    public function sitemap()
    {
        $urls = collect([
            ['loc' => $this->absoluteUrl(route('home', [], false)), 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => $this->absoluteUrl(route('about', [], false)), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => $this->absoluteUrl(route('contact', [], false)), 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['loc' => $this->absoluteUrl(route('jobs.index', [], false)), 'priority' => '0.9', 'changefreq' => 'hourly'],
            ['loc' => $this->absoluteUrl(route('companies.index', [], false)), 'priority' => '0.8', 'changefreq' => 'daily'],
        ]);

        Job::with('company')->public()->latest()->limit(250)->get()->each(function (Job $job) use ($urls) {
            $urls->push([
                'loc' => $this->absoluteUrl(route('jobs.show', ['job' => $job->slug], false)),
                'lastmod' => $job->updated_at?->toAtomString(),
                'priority' => '0.7',
                'changefreq' => 'daily',
            ]);
        });

        Company::where('verification_status', 'approved')
            ->where('is_active', true)
            ->latest()
            ->limit(250)
            ->get()
            ->each(function (Company $company) use ($urls) {
                $urls->push([
                    'loc' => $this->absoluteUrl(route('companies.show', ['company' => $company->slug], false)),
                    'lastmod' => $company->updated_at?->toAtomString(),
                    'priority' => '0.6',
                    'changefreq' => 'weekly',
                ]);
            });

        Category::withCount(['jobs' => fn ($query) => $query->public()])
            ->where('is_active', true)
            ->having('jobs_count', '>', 0)
            ->get()
            ->each(function (Category $category) use ($urls) {
                $urls->push([
                    'loc' => $this->absoluteUrl(route('jobs.index', ['category_id' => $category->id], false)),
                    'lastmod' => $category->updated_at?->toAtomString(),
                    'priority' => '0.5',
                    'changefreq' => 'weekly',
                ]);
            });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return Response::make($xml, 200, ['Content-Type' => 'application/xml']);
    }

    public function robots()
    {
        return Response::make(implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /employee',
            'Disallow: /employer',
            'Sitemap: '.$this->absoluteUrl('/sitemap.xml'),
            '',
        ]), 200, ['Content-Type' => 'text/plain']);
    }

    public function jobs(Request $request)
    {
        $jobs = Job::with(['company', 'category', 'location'])
            ->public()
            ->when($request->search ?? $request->keyword, fn ($query, $search) => $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")))
            ->when($request->category_id, fn ($query, $id) => $query->where('category_id', $id))
            ->when($request->location_id, fn ($query, $id) => $query->where('location_id', $id))
            ->when($request->location && ! $request->location_id, fn ($query, $location) => $query->whereHas('location', fn ($q) => $q->where('name', $location)))
            ->when($request->job_type, fn ($query, $type) => $query->where('job_type', $type))
            ->when($request->experience_level, fn ($query, $level) => $query->where('experience_level', $level))
            ->when($request->salary_min, fn ($query, $min) => $query->where('salary_max', '>=', $min))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/jobs/index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'keyword', 'category_id', 'location_id', 'location', 'job_type', 'experience_level', 'salary_min']),
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
            'locations' => Location::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function showJob(Request $request, Job $job)
    {
        abort_unless($job->status === 'active' && $job->deadline->isFuture(), 404);

        $job->load(['company', 'category', 'location', 'skills']);

        return Inertia::render('public/jobs/show', [
            'job' => $job,
            'hasApplied' => $request->user()?->applications()->where('job_id', $job->id)->exists() ?? false,
            'isSaved' => $request->user()?->savedJobs()->where('job_id', $job->id)->exists() ?? false,
            'relatedJobs' => Job::with(['company', 'category', 'location'])->public()->where('category_id', $job->category_id)->whereKeyNot($job->id)->take(4)->get(),
        ]);
    }

    public function companies(Request $request)
    {
        return Inertia::render('public/companies/index', [
            'companies' => Company::withCount(['jobs' => fn ($query) => $query->public()])
                ->where('verification_status', 'approved')
                ->where('is_active', true)
                ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(12)
                ->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function showCompany(Company $company)
    {
        abort_unless($company->verification_status === 'approved' && $company->is_active, 404);

        return Inertia::render('public/companies/show', [
            'company' => $company,
            'jobs' => $company->jobs()->with(['category', 'location'])->public()->latest()->paginate(10),
        ]);
    }

    public function apply(ApplicationRequest $request, Job $job)
    {
        abort_unless($job->status === 'active' && $job->deadline->isFuture(), 404);

        $data = $request->validated();
        if ($request->hasFile('cv_file')) {
            $data['cv_file'] = $request->file('cv_file')->store('applications', 'public');
        }

        Application::firstOrCreate(
            ['job_id' => $job->id, 'user_id' => $request->user()->id],
            $data + ['status' => 'pending']
        );

        return back()->with('success', 'Application submitted.');
    }

    public function toggleSave(Request $request, Job $job)
    {
        abort_unless($request->user()?->isEmployee(), 403);

        $saved = SavedJob::where('job_id', $job->id)->where('user_id', $request->user()->id)->first();
        $saved ? $saved->delete() : SavedJob::create(['job_id' => $job->id, 'user_id' => $request->user()->id]);

        return back()->with('success', $saved ? 'Job removed from saved jobs.' : 'Job saved.');
    }

    private function homepageLiveData(): array
    {
        return [
            'stats' => [
                ...Cache::remember('homepage.stats', 60, fn () => [
                    'jobs' => Job::public()->count(),
                    'companies' => Company::where('verification_status', 'approved')->where('is_active', true)->count(),
                    'categories' => Category::where('is_active', true)->count(),
                    'candidates' => User::where('role', 'employee')->where('status', 'active')->count(),
                    'applications' => Application::count(),
                ]),
            ],
            'featured_jobs' => Job::with(['company', 'category', 'location'])
                ->public()
                ->latest()
                ->take(6)
                ->get(),
            'featured_companies' => Company::withCount(['jobs' => fn ($query) => $query->public()])
                ->where('verification_status', 'approved')
                ->where('is_active', true)
                ->whereHas('jobs', fn ($query) => $query->public())
                ->orderByDesc('jobs_count')
                ->take(6)
                ->get(),
            'categories' => Category::withCount(['jobs' => fn ($query) => $query->public()])
                ->where('is_active', true)
                ->orderByDesc('jobs_count')
                ->orderBy('name')
                ->take(10)
                ->get(),
        ];
    }

    private function homepageJsonLd(string $canonicalUrl, string $description, $jobs): array
    {
        $organization = [
            '@type' => 'Organization',
            '@id' => $this->absoluteUrl('/#organization'),
            'name' => config('app.name', 'Galaxy Jobs'),
            'url' => $this->absoluteUrl('/'),
            'logo' => $this->absoluteUrl('/apple-touch-icon.png'),
        ];

        return [
            [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                '@id' => $this->absoluteUrl('/#website'),
                'name' => config('app.name', 'Galaxy Jobs'),
                'url' => $this->absoluteUrl('/'),
                'description' => $description,
                'publisher' => ['@id' => $this->absoluteUrl('/#organization')],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => $this->absoluteUrl(route('jobs.index', ['keyword' => '{search_term_string}'], false)),
                    'query-input' => 'required name=search_term_string',
                ],
            ],
            $organization,
            ...$jobs->map(fn (Job $job) => $this->jobPostingJsonLd($job))->values()->all(),
        ];
    }

    private function pageSeo(string $title, string $description, string $canonicalUrl, array $jsonLd): array
    {
        return [
            'title' => $title,
            'description' => $description,
            'keywords' => 'Galaxy Jobs, Galaxy Technology, Afghanistan jobs, recruitment platform',
            'canonical' => $canonicalUrl,
            'image' => $this->absoluteUrl('/apple-touch-icon.png'),
            'type' => 'website',
            'robots' => 'index, follow',
            'jsonLd' => $jsonLd,
        ];
    }

    private function jobSeo(Job $job): array
    {
        $description = Str::limit(strip_tags($job->description), 160);
        $canonicalUrl = $this->absoluteUrl(route('jobs.show', $job, false));

        return $this->pageSeo(
            $job->title.' at '.$job->company->name.' - Galaxy Jobs',
            $description,
            $canonicalUrl,
            [$this->jobPostingJsonLd($job), $this->organizationJsonLd()]
        );
    }

    private function companySeo(Company $company): array
    {
        $description = Str::limit(strip_tags($company->description), 160);
        $canonicalUrl = $this->absoluteUrl(route('companies.show', $company, false));

        return $this->pageSeo(
            $company->name.' Careers - Galaxy Jobs',
            $description,
            $canonicalUrl,
            [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Organization',
                    'name' => $company->name,
                    'url' => $canonicalUrl,
                    'description' => $description,
                ],
                $this->organizationJsonLd(),
            ]
        );
    }

    private function jobPostingJsonLd(Job $job): array
    {
        $job->loadMissing(['company', 'location']);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'JobPosting',
            'title' => $job->title,
            'description' => strip_tags($job->description),
            'datePosted' => $job->created_at?->toDateString(),
            'validThrough' => $job->deadline?->toAtomString(),
            'employmentType' => strtoupper($job->job_type ?? 'FULL_TIME'),
            'hiringOrganization' => [
                '@type' => 'Organization',
                'name' => $job->company?->name ?? config('app.name', 'Galaxy Jobs'),
                'sameAs' => $this->absoluteUrl('/'),
                'logo' => $this->absoluteUrl('/apple-touch-icon.png'),
            ],
            'jobLocation' => [
                '@type' => 'Place',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => $job->location?->name ?? 'Afghanistan',
                    'addressCountry' => 'AF',
                ],
            ],
        ];
    }

    private function organizationJsonLd(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => $this->absoluteUrl('/#organization'),
            'name' => 'Galaxy Technology',
            'url' => $this->absoluteUrl('/'),
            'logo' => $this->absoluteUrl('/apple-touch-icon.png'),
            'sameAs' => [
                'https://galaxytechology.com',
            ],
        ];
    }

    private function contactInfo(): array
    {
        return [
            'email' => 'galaxytech2030@gmail.com',
            'phone' => '+93 77 197 8659',
            'address' => 'Balkh, Afghanistan',
        ];
    }

    private function absoluteUrl(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return rtrim(config('app.url'), '/').'/'.ltrim($path, '/');
    }
}
