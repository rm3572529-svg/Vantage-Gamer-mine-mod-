import { useState } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Star, Clock, Flame, ChevronDown, PackageOpen } from "lucide-react";
import { useListMods } from "@workspace/api-client-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function Mods() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("trending");

  const { data, isLoading } = useListMods({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
    sort: sort as any,
  });

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "mod", label: "Mods" },
    { id: "tool", label: "Tools" },
    { id: "texture", label: "Textures" },
    { id: "shader", label: "Shaders" },
    { id: "utility", label: "Utilities" },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Mods</h1>
            <p className="text-muted-foreground mt-1">Find the best add-ons for your game</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search mods..." 
                className="pl-9 bg-card border-border/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/40 bg-card gap-2">
                  <Filter className="h-4 w-4" />
                  {categories.find(c => c.id === category)?.label}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                  {categories.map(c => (
                    <DropdownMenuRadioItem key={c.id} value={c.id}>
                      {c.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/40 bg-card gap-2">
                  {sort === 'trending' ? <Flame className="h-4 w-4" /> : sort === 'latest' ? <Clock className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  <span className="capitalize">{sort}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="trending">Trending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="latest">Latest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="top">Top Rated</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : !data?.mods?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/60 rounded-3xl bg-card/30">
            <PackageOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold">No mods found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              We couldn't find any mods matching your criteria. Try adjusting your filters or search term.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setCategory("all"); setSort("trending"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.mods.map((mod) => (
              <Link key={mod.id} href={`/mods/${mod.id}`} className="group flex flex-col rounded-2xl bg-card border border-border/40 overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                  {mod.bannerImage ? (
                    <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center p-4 text-center font-bold text-lg text-foreground/50 group-hover:scale-105 transition-transform duration-500">
                      {mod.title}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold capitalize border border-border/50">
                    {mod.category}
                  </div>
                  {mod.featured && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-bold shadow-md">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4 line-clamp-2 flex-1">{mod.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                        {mod.developerName?.charAt(0) || '?'}
                      </div>
                      <span className="truncate">{mod.developerName}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {mod.downloadCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" />
                        {mod.likeCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
