namespace Application.Features.Industry;
using Domain.Entities;
using Application.Industries.DTOs;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class IndustryService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<IndustryService> _logger;
    public IndustryService(IApplicationDBContext context, ILogger<IndustryService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IndustryDTO?> getIndustry(int id)
    {
        var returned = await _context.Industry
        .Where(industry => industry.Id == id)
        .FirstOrDefaultAsync();

        return new IndustryDTO
        {
            Name = returned.Name,
            CreationDate = returned.CreatedDate
        };
    }

    public async Task<int?> createIndustry(string name)
    {
        var industry = new Industry
        {
            Name = name,
            CreatedDate = DateTime.UtcNow,
            ModifiedDate = DateTime.UtcNow
        };

        await _context.Industry.AddAsync(industry);
        return industry.Id;
    }

    public async Task<int?> updateIndustry(int id, string name)
    {
        var industry = await _context.Industry.FirstOrDefaultAsync(industry => industry.Id == id);
        industry.Name = name;
        industry.ModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return industry.Id;
    }

    public async Task<int?> deleteIndustry(int id)
    {
        var industry = await _context.Industry.FirstOrDefaultAsync(industry => industry.Id == id);
        _context.Industry.Remove(industry);
        await _context.SaveChangesAsync();
        return industry.Id;
    }
}
