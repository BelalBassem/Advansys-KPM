namespace Application.Features.Industry;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using IndustryEntity = Domain.Entities.Industry;

public class IndustryService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<IndustryService> _logger;
    public IndustryService(IApplicationDBContext context, ILogger<IndustryService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<IndustryEntity>> getAllIndustries()
    {
        return await _context.Industry.ToListAsync();
    }

    public async Task<IndustryEntity?> getIndustry(int id)
    {
        return await _context.Industry
        .Where(industry => industry.Id == id)
        .FirstOrDefaultAsync();
    }

    public async Task<int> createIndustry(string name)
    {
        var industry = new IndustryEntity
        {
            Name = name,
            CreatedDate = DateTime.Now,
            ModifiedDate = DateTime.Now
        };

        await _context.Industry.AddAsync(industry);
        await _context.SaveChangesAsync();
        return industry.Id;
    }

    public async Task<int?> updateIndustry(int id, string name)
    {
        var industry = await _context.Industry.FirstOrDefaultAsync(industry => industry.Id == id);

        if (industry is null)
            return null;

        industry.Name = name;
        industry.ModifiedDate = DateTime.Now;
        await _context.SaveChangesAsync();
        return industry.Id;
    }

    public async Task<int?> deleteIndustry(int id)
    {
        var industry = await _context.Industry.FirstOrDefaultAsync(industry => industry.Id == id);

        if (industry is null)
            return null;

        _context.Industry.Remove(industry);
        await _context.SaveChangesAsync();
        return industry.Id;
    }
}
