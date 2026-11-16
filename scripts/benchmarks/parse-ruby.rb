#!/usr/bin/env ruby
# frozen_string_literal: true

# Corpus parse timing (ruby leg): Interscript::Interpreter.parse_isc over
# every corpus .isc, in-process, RUNS runs. Methodology follows
# maps/docs/parity/README.md §A.8 (median-of-3, clean serial runs).
#
# The orchestrator invokes this as:
#   ruby -I<RUBY_LIB> parse-ruby.rb <maps_dir>
# so the engine under test is the sibling interscript-ruby checkout.

maps_dir = ARGV[0]
RUNS = 3

require "interscript"

files = Dir["#{maps_dir}/*.isc"].sort
abort "no .isc files under #{maps_dir}" if files.empty?

RUNS.times do
  ok = 0
  t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  files.each do |f|
    begin
      Interscript::Interpreter.parse_isc(f)
      ok += 1
    rescue StandardError => e
      warn "FAIL #{File.basename(f)}: #{e.message.lines.first&.chomp}"
    end
  end
  t1 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  puts format("ruby parse %d/%d maps in %.1f ms", ok, files.size, (t1 - t0) * 1000)
end
