namespace Application.Features.Department;
using Domain.Entities;
using Application.Departments.DTOs;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class DepartmentService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<DepartmentService> _logger;
    public DepartmentService(IApplicationDBContext context, ILogger<DepartmentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<DepartmentDTO?> getDepartment(int id)
    {
        try
        {
            var returned = await _context.Department
            .Where(department => department.Id == id)
            .FirstOrDefaultAsync();

            if (returned is null)
            {
                _logger.LogWarning("Department {DepartmentId} was not found", id);
                return null;
            }

            _logger.LogInformation("Department {DepartmentId} was retrieved successfully", id);

            return new DepartmentDTO
            {
                Name = returned.Name,
                CreationDate = returned.CreatedDate
            };
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to retrieve department {DepartmentId}", id);
            throw;
        }
    }

    public async Task<int?> createDepartment(string name)
    {
        try
        {
            var department = new Department
            {
                Name = name,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            await _context.Department.AddAsync(department);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Department {DepartmentId} was created successfully", department.Id);
            return department.Id;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to create department");
            throw;
        }
    }

    public async Task<int?> updateDepartment(int id , string name)
    {
        try
        {
            var department = await _context.Department.FirstOrDefaultAsync(department => department.Id == id);

            if (department is null)
            {
                _logger.LogWarning("Department {DepartmentId} was not found for update", id);
                return null;
            }

            department.Name = name;
            department.ModifiedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Department {DepartmentId} was updated successfully", id);
            return department.Id;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to update department {DepartmentId}", id);
            throw;
        }
    }

    public async Task<int?> deleteDepartment(int id)
    {
        try
        {
            var department = await _context.Department.FirstOrDefaultAsync(department => department.Id == id);

            if (department is null)
            {
                _logger.LogWarning("Department {DepartmentId} was not found for deletion", id);
                return null;
            }

            _context.Department.Remove(department);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Department {DepartmentId} was deleted successfully", id);
            return department.Id;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to delete department {DepartmentId}", id);
            throw;
        }
    }
}
