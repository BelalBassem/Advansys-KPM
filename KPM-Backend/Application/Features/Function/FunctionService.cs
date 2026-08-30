namespace Application.Features.Function;
using Domain.Entities;
using Application.Functions.DTOs;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class FunctionService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<FunctionService> _logger;
    public FunctionService(IApplicationDBContext context, ILogger<FunctionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<FunctionDTO?> getFunction(int id)
    {
        var returned = await _context.Function
        .Where(function => function.Id == id)
        .FirstOrDefaultAsync();

        return new FunctionDTO
        {
            Name = returned.Name,
            CreationDate = returned.CreatedDate
        };
    }

    public async Task<int?> createFunction(string name)
    {
        var function = new Function
        {
            Name = name,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow
        };

        await _context.Function.AddAsync(function);
        return function.Id;
    }

    public async Task<int?> updateFunction(int id, string name)
    {
        var function = await _context.Function.FirstOrDefaultAsync(function => function.Id == id);
        function.Name = name;
        function.LastModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return function.Id;
    }

    public async Task<int?> deleteFunction(int id)
    {
        var function = await _context.Function.FirstOrDefaultAsync(function => function.Id == id);
        _context.Function.Remove(function);
        await _context.SaveChangesAsync();
        return function.Id;
    }
}
